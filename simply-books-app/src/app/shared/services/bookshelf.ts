import { inject, Injectable, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import {catchError, map, of, switchMap, from, Observable, tap} from 'rxjs';

import { BookInterface } from '../interfaces/book-interface';
import { Storage } from './storage';
import { Auth } from './auth';
import { SocialFeedService } from './social-feed-service';
import { BooksService } from './books-service';
import { SUPABASE_FILES_BUCKET } from '../../../environments/environment';
import { User } from '../interfaces/user';

export type BookShelfItem = Pick<
  BookInterface,
  | 'id'
  | 'title'
  | 'author'
  | 'year'
  | 'portrait_url'
  | 'file_url'
  | 'description'
  | 'rating'
  | 'pages'
  | 'pages_read'
  | 'reading_status'
>;

@Injectable({
  providedIn: 'root',
})
export class BookshelfService {
  private bookshelf = signal<BookShelfItem[]>([]);
  private loanedBookIds = signal<Set<string>>(new Set());

  private authService = inject(Auth);
  private storageService = inject(Storage);
  private socialFeed = inject(SocialFeedService);
  private booksService = inject(BooksService);

  // ✅ Getter de libros locales
  get bookshelvesItems(): BookShelfItem[] {
    return this.bookshelf();
  }

  // ✅ Getter de libros disponibles (no prestados)
  get availableBooks(): BookShelfItem[] {
    const loanedIds = this.loanedBookIds();
    return this.bookshelf().filter(book => !loanedIds.has(String(book.id)));
  }

  // ✅ Cargar archivos del usuario desde Supabase Storage
  loadUserFiles(user: User): Observable<BookShelfItem[]> {
    if (!user.username) {
      console.error('No username provided');
      return of([]);
    }

    return from(this.storageService.listUserFiles(user.username)).pipe(
      switchMap(files =>
        Promise.all(
          files.map(async file => {
            const fullPath = `${user.username}/${file.name}`;
            const fileUrl = this.storageService.getFileUrl(fullPath, SUPABASE_FILES_BUCKET);
            const fullName = file.name;
            const nameWithoutExt =
              fullName.substring(0, fullName.lastIndexOf('.')) || fullName;

            let bookData: Partial<BookShelfItem> = {};

            try {
              const searchResult = await this.booksService
                .searchBooks(nameWithoutExt, 1)
                .toPromise();

              if (searchResult && searchResult.books.length > 0) {
                const foundBook = searchResult.books[0];
                bookData = {
                  title: foundBook.title,
                  author: foundBook.author,
                  year: foundBook.year,
                  portrait_url: foundBook.portrait_url,
                  pages: foundBook.pages,
                  description: foundBook.description,
                };
              }
            } catch {
              console.warn(`No se encontró información de ${nameWithoutExt}`);
            }

            return {
              id: uuidv4(),
              title: bookData.title || nameWithoutExt,
              author: bookData.author || '',
              year: bookData.year || 0,
              portrait_url: bookData.portrait_url || '',
              file_url: fileUrl,
              description: bookData.description || '',
              rating: 0,
              pages: bookData.pages || 0,
              pages_read: 0,
              reading_status: 'Por leer',
            } as BookShelfItem;
          })
        )
      ),
      map(bookItems => {
        this.bookshelf.set(bookItems);
        return bookItems;
      }),
      catchError(err => {
        console.error('Error loading user files:', err);
        return of([]);
      })
    );
  }

  // ✅ Cargar libros desde el backend
  loadBooksFromApi(userId?: string): Observable<BookShelfItem[]> {
    const targetUserId = userId || this.authService.getUserLogged()?.id;
    if (!targetUserId) {
      console.warn('No user ID available for loading books from API');
      return of([]);
    }

    return this.booksService.getBooksByUser(targetUserId).pipe(
      map(apiBooks => {
        if (!apiBooks || apiBooks.length === 0) {
          this.bookshelf.set([]);
          return [];
        }

        const booksToAdd: BookShelfItem[] = apiBooks.map(b => ({
          id: b.id || uuidv4(),
          title: b.title,
          author: b.author,
          year: b.year || 0,
          portrait_url: b.portrait_url || 'assets/default-cover.jpg',
          file_url: b.file_url || '',
          description: b.description || '',
          rating: b.rating || 0,
          pages: b.pages || 0,
          pages_read: b.pages_read || 0,
          reading_status: b.reading_status || 'Por leer',
        }));

        this.bookshelf.set(booksToAdd);
        return booksToAdd;
      }),
      catchError(err => {
        console.error('Error loading API books:', err);
        return of([]);
      })
    );
  }

// Reemplaza el método addBook en bookshelf.service.ts

  addBook(book: BookShelfItem): Observable<boolean> {
    console.log('📚 Intentando agregar libro:', book);

    if (!book.reading_status) book.reading_status = 'Por leer';

    const user = this.authService.getUserLogged();
    console.log('👤 Usuario actual:', user);

    if (!user?.id) {
      console.warn('⚠️ No hay userId, guardando solo localmente');
      // Verificar solo localmente si no hay usuario
      const existsLocally = this.bookshelf().some(b => b.id === book.id);
      if (existsLocally) {
        console.warn('⚠️ Libro ya existe localmente');
        return of(false);
      }
      this.bookshelf.update(items => [...items, book]);
      return of(true);
    }

    const bookToSave = { ...book} as BookInterface;
    console.log('🚀 Llamando a saveBookToBackend...');
    return this.booksService.saveBookToBackend(bookToSave, user.id).pipe(
      tap((response) => {
        console.log('📥 Respuesta backend:', response);
        if (response && response.id) {
          // Usar el ID generado por el backend
          const bookWithBackendId = { ...book, id: response.id };

          // Verificar si ya existe localmente con el ID del backend
          const existsLocally = this.bookshelf().some(b => b.id === response.id);
          if (!existsLocally) {
            this.bookshelf.update(items => [...items, bookWithBackendId]);
            console.log('✅ Libro guardado en backend y añadido localmente con ID:', response.id);
          } else {
            console.log('ℹ️ Libro ya existe localmente con el ID del backend');
          }
        }
      }),
      map(response => {
        // Retornar true si el backend guardó exitosamente
        return !!response;
      }),
      catchError(err => {
        console.error('❌ Error guardando libro en backend:', err);
        // Si el error es por duplicado (409), retornar false
        if (err.status === 409) {
          console.warn('⚠️ El libro ya existe en el backend');
          return of(false);
        }
        return of(false);
      })
    );
  }


  loadBooksFromBackend(userId: string): Observable<void> {
    return this.booksService.getBooksByUser(userId).pipe(
      tap((books) => {
        this.bookshelf.set(books);
        console.log('📚 Libros cargados desde backend:', books);
      }),
      map(() => void 0),
      catchError(err => {
        console.error('❌ Error cargando libros desde backend:', err);
        return of(void 0);
      })
    );
  }


  // ✅ Desde búsqueda de Open Library
  addBookFromOpenLibrary(openLibraryBook: BookInterface): Observable<boolean> {
    const bookItem: BookShelfItem = {
      id: openLibraryBook.id || uuidv4(),
      title: openLibraryBook.title,
      author: openLibraryBook.author,
      year: openLibraryBook.year,
      portrait_url: openLibraryBook.portrait_url,
      file_url: '',
      description: openLibraryBook.description || '',
      rating: 0,
      pages: openLibraryBook.pages,
      pages_read: 0,
      reading_status: 'Por leer',
    };

    return this.addBook(bookItem);
  }

  // ✅ Actualizar libro local + backend
  updateBook(updated: BookInterface): boolean {
    if (updated.pages_read && updated.pages_read > updated.pages) {
      alert('⚠️ Las páginas leídas no pueden ser mayores que el total de páginas');
      return false;
    }
    if (updated.rating && updated.rating > 5) {
      alert('⚠️ La puntuación máxima es 5 estrellas');
      return false;
    }

    let newStatus = 'Por leer';
    if (updated.pages_read === updated.pages) newStatus = 'Leído';
    else if (updated.pages_read && updated.pages_read > 0) newStatus = 'Leyendo';

    this.bookshelf.update(items =>
      items.map(b =>
        b.id === updated.id ? { ...b, ...updated, reading_status: newStatus } : b
      )
    );

    const user = this.authService.getUserLogged();
    if (user?.id && updated.userId) {
      this.booksService.updateBookInBackend(updated.userId, updated).pipe(
        catchError(err => {
          console.error('Error updating in backend:', err);
          return of(null);
        })
      ).subscribe();
    }

    if (newStatus === 'Leído') {
      this.socialFeed.createCompletedBookPost(updated);
    }

    return true;
  }

  // ✅ Eliminar libro local
  removeBook(id: string) {
    this.bookshelf.update(items => items.filter(b => b.id !== id));
  }

  markAsLoaned(bookId: string) {
    this.loanedBookIds.update(ids => new Set([...ids, bookId]));
  }

  markAsAvailable(bookId: string) {
    this.loanedBookIds.update(ids => {
      const newSet = new Set(ids);
      newSet.delete(bookId);
      return newSet;
    });
  }

  // 🔍 Buscar libros en Open Library
  searchOpenLibrary(query: string, limit = 10) {
    return this.booksService.searchBooks(query, limit);
  }
}
