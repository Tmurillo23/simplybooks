import { inject, Injectable, signal } from '@angular/core';
import { BookInterface } from '../interfaces/book-interface';
import { Storage } from './storage';
import { Auth } from './auth';
import { SocialFeedService } from './social-feed-service';
import { BooksService } from './books-service';
import { SUPABASE_FILES_BUCKET } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export type BookShelfItem = Pick<
  BookInterface,
  'id' | 'title' | 'author' | 'year' | 'portrait_url' | 'file_url' | 'description' | 'rating' | 'pages' | 'pages_read' | 'reading_status'
>

@Injectable({
  providedIn: 'root'
})
export class BookshelfService {
  private bookshelf = signal<BookShelfItem[]>([]);
  private loanedBookIds = signal<Set<number>>(new Set());

  authService = inject(Auth);
  storageService = inject(Storage);
  socialFeed = inject(SocialFeedService);
  booksService = inject(BooksService);

  // Generate stable ID based on file path
  private generateStableId(filePath: string): number {
    let hash = 0;
    for (let i = 0; i < filePath.length; i++) {
      const char = filePath.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  get bookshelvesItems(): BookShelfItem[] {
    return this.bookshelf();
  }

  get availableBooks() {
    const loanedIds = this.loanedBookIds();
    return this.bookshelf().filter(book => !loanedIds.has(book.id));
  }

  async loadUserFiles() {
    const user = this.authService.getUserLogged();
    if (!user.username) {
      console.error('No user logged in');
      return;
    }

    try {
      const files = await this.storageService.listUserFiles(user.username);

      const bookItems: BookShelfItem[] = await Promise.all(
        files.map(async (file) => {
          const fullPath = `${user.username}/${file.name}`;
          const fileUrl = this.storageService.getFileUrl(fullPath, SUPABASE_FILES_BUCKET);
          const fullName = file.name;
          const nameWithoutExt = fullName.substring(0, fullName.lastIndexOf('.')) || fullName;

          // Try to find book in Open Library
          let bookData: Partial<BookShelfItem> = {};
          try {
            const searchResult = await this.booksService.searchBooks(nameWithoutExt, 1).toPromise();
            if (searchResult && searchResult.books.length > 0) {
              const foundBook = searchResult.books[0];
              bookData = {
                title: foundBook.title,
                author: foundBook.author,
                year: foundBook.year,
                portrait_url: foundBook.portrait_url,
                pages: foundBook.pages,
                description: foundBook.description
              };
            }
          } catch (error) {
            console.warn(`Could not find book "${nameWithoutExt}" in Open Library:`, error);
          }

          const bookItem = {
            id: this.generateStableId(fullPath),
            title: bookData.title || nameWithoutExt,
            author: bookData.author || '',
            year: bookData.year || 0,
            portrait_url: bookData.portrait_url || '',
            file_url: fileUrl,
            description: bookData.description || '',
            rating: 0,
            pages: bookData.pages || 0,
            pages_read: 0,
            reading_status: 'Por leer'
          };

          return bookItem;
        })
      );

      this.bookshelf.set(bookItems);
    } catch (error) {
      console.error('Error loading user files:', error);
    }
  }

  async loadBooksFromApi() {
    const user = this.authService.getUserLogged();
    if (!user?.id) {
      console.warn('No user ID available for loading books from API');
      return;
    }

    try {
      console.log('Loading books from API for user:', user.id);
      const apiBooks = await this.booksService.getBooksByUser(user.id).toPromise();
      
      if (apiBooks && apiBooks.length > 0) {
        console.log('Loaded books from API:', apiBooks.length);
        
        const booksToAdd: BookShelfItem[] = apiBooks.map(b => ({
          id: b.id,
          title: b.title,
          author: b.author,
          year: b.year || 0,
          portrait_url: b.portrait_url || 'assets/default-cover.jpg',
          file_url: b.file_url || '', // This will be empty for backend books
          description: b.description || '',
          rating: b.rating || 0,
          pages: b.pages || 0,
          pages_read: b.pages_read || 0,
          reading_status: b.reading_status || 'Por leer'
        }));

        // Replace the current bookshelf with books from API
        this.bookshelf.set(booksToAdd);
      } else {
        console.log('No books found in API for user');
      }
    } catch (error) {
      console.error('Error loading API books:', error);
    }
  }

  async addBook(book: BookShelfItem): Promise<boolean> {
    // Asegurar reading_status
    if (!book.reading_status) {
      book.reading_status = 'Por leer';
    }

    let exists = false;
    this.bookshelf.update(items => {
      exists = items.some(b => b.id === book.id);
      return exists ? items : [...items, book];
    });

    if (!exists) {
      // Save to backend if user is logged in
      const user = this.authService.getUserLogged();
      if (user?.id) {
        try {
          console.log('Saving book to backend for user:', user.id);
          await this.booksService.saveBookToBackend(book as BookInterface, user.id).toPromise();
          console.log('Book saved successfully to backend');
        } catch (error) {
          console.error('Error saving book to backend:', error);
          // Remove from local state if backend save fails
          this.bookshelf.update(items => items.filter(b => b.id !== book.id));
          return false;
        }
      } else {
        console.warn('No user ID available, book saved only locally');
      }
    }

    return !exists;
  }

  // Add book from Open Library search
  async addBookFromOpenLibrary(openLibraryBook: BookInterface): Promise<boolean> {
    const bookItem: BookShelfItem = {
      id: openLibraryBook.id,
      title: openLibraryBook.title,
      author: openLibraryBook.author,
      year: openLibraryBook.year,
      portrait_url: openLibraryBook.portrait_url,
      file_url: '',
      description: openLibraryBook.description || '',
      rating: 0,
      pages: openLibraryBook.pages,
      pages_read: 0,
      reading_status: 'Por leer'
    };

    return this.addBook(bookItem);
  }

  updateBook(updated: BookInterface): boolean {
    // Validaciones
    if (updated.pages_read && updated.pages_read > updated.pages) {
      alert('⚠️ Las páginas leídas no pueden ser mayores que el total de páginas');
      return false;
    }

    if (updated.rating && updated.rating > 5) {
      alert('⚠️ La puntuación máxima es 5 estrellas');
      return false;
    }

    // Calcular el estado de lectura automáticamente
    let newStatus = 'Por leer';
    if (updated.pages_read === updated.pages) {
      newStatus = 'Leído';
    } else if (updated.pages_read && updated.pages_read > 0) {
      newStatus = 'Leyendo';
    }

    // Actualizar el libro usando el estado recalculado
    this.bookshelf.update(items =>
      items.map(b =>
        b.id === updated.id ? { ...b, ...updated, reading_status: newStatus } : b
      )
    );

    // Update in backend if user is logged in
    const user = this.authService.getUserLogged();
    if (user?.id && updated.userId) {
      this.booksService.updateBookInBackend(updated.userId, updated).pipe(
        catchError(error => {
          console.error('Error updating book in backend:', error);
          return of(null);
        })
      ).subscribe();
    }

    if (newStatus === 'Leído') {
      this.socialFeed.createCompletedBookPost(updated);
    }

    return true;
  }

  removeBook(id: number) {
    this.bookshelf.update(items => items.filter(b => b.id !== id));
    
    // Note: Backend deletion would require the backend UUID, which we don't have
    // You might want to implement a way to track backend IDs
  }

  markAsLoaned(bookId: number) {
    this.loanedBookIds.update(ids => {
      const newSet = new Set(ids);
      newSet.add(bookId);
      return newSet;
    });
  }

  markAsAvailable(bookId: number) {
    this.loanedBookIds.update(ids => {
      const newSet = new Set(ids);
      newSet.delete(bookId);
      return newSet;
    });
  }

  // Search books in Open Library
  searchOpenLibrary(query: string, limit: number = 10) {
    return this.booksService.searchBooks(query, limit);
  }
}