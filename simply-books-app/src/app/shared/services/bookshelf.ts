import { inject, Injectable, signal } from '@angular/core';
import { BookInterface } from '../interfaces/book-interface';
import { Storage } from './storage';
import { Auth } from './auth';

export type BookShelfItem = Pick<
  BookInterface,
  'id' | 'title' | 'author' | 'year' | 'portrait_url' | 'file_url' | 'description' | 'rating' | 'pages' | 'pages_read'| 'reading_status'
>

@Injectable({
  providedIn: 'root'
})
export class BookshelfService {
  private bookshelf = signal<BookShelfItem[]>([]);
  private loanedBookIds = signal<Set<number>>(new Set());

  authService = inject(Auth);
  storageService = inject(Storage);

  // Generar ID estable basado en la ruta del archivo
  private generateStableId(filePath: string): number {
    let hash = 0;
    for (let i = 0; i < filePath.length; i++) {
      const char = filePath.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  // Devuelve el array real de libros
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

      const bookItems: BookShelfItem[] = files.map(file => {
        const fullPath = `${user.username}/${file.name}`;
        const fileUrl = this.storageService.getFileUrl(fullPath);
        const fullName = file.name;
        const nameWithoutExt = fullName.substring(0, fullName.lastIndexOf('.')) || fullName;

        return {
          id: this.generateStableId(fullPath),
          title: nameWithoutExt,
          author: '',
          year: 0,
          portrait_url: '',
          file_url: fileUrl,
          description: '',
          rating: 0,
          pages: 0,
          pages_read: 0,
          reading_status: 'Por leer'
        };
      });

      this.bookshelf.update(currentItems => {
        const combinedItems = [...currentItems];

        bookItems.forEach(newBook => {
          const exists = combinedItems.some(existingBook => existingBook.id === newBook.id);
          if (!exists) {
            combinedItems.push(newBook);
          }
        });

        return combinedItems;
      });
    } catch (error) {
      console.error('Error loading user files:', error);
    }
  }

  addBook(book: BookShelfItem): boolean {
    // Asegurar reading_status
    if (!book.reading_status) {
      book.reading_status = 'Por leer';
    }

    let exists = false;
    this.bookshelf.update(items => {
      exists = items.some(b => b.id === book.id);
      return exists ? items : [...items, book];
    });

    return !exists;
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

    return true;
  }



  removeBook(id: number) {
    this.bookshelf.update(items => items.filter(b => b.id !== id));
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
}
