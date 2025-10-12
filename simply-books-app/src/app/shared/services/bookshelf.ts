import { inject, Injectable, signal } from '@angular/core';
import { BookInterface } from '../interfaces/book-interface';
import { Storage } from './storage';
import { Auth } from './auth';


export type BookShelfItem = Pick<
  BookInterface,
  'id' | 'title' | 'author' | 'year' | 'portrait_url' | 'file_url' | 'description' | 'rating' | 'pages' | 'pages_read'
>;

@Injectable({
  providedIn: 'root'
})
export class BookshelfService {
  private _bookshelf = signal<BookShelfItem[]>([]);

  authService = inject(Auth);
  storageService = inject(Storage);

  // Generar ID estable basado en la ruta del archivo
  private generateStableId(filePath: string): number {
    let hash = 0;
    for (let i = 0; i < filePath.length; i++) {
      const char = filePath.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  get bookshelvesItems() {
    return this._bookshelf;
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
          id: this.generateStableId(fullPath), // ID estable dependiendo de la ruta
          title: nameWithoutExt,
          author: '',
          year: 0,
          portrait_url: '',
          file_url: fileUrl,
          description: '',
          rating: 0,
          pages: 0,
          pages_read: 0
        };
      });

      this._bookshelf.update(currentItems => {
        // Combinar items obtenidos de la DB con los ya existentes en this._bookshelf
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
    let exists = false;

    this._bookshelf.update(items => {
      exists = items.some(b => b.id === book.id);
      return exists ? items : [...items, book];
    });

    return !exists; // true = agregado, false = ya existía
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

    this._bookshelf.update(items =>
      items.map(b => (b.id === updated.id ? updated : b))
    );

    return true; // actualizacion exitosa
  }

  removeBook(id: number) {
    this._bookshelf.update(items => items.filter(b => b.id !== id));
  }
}
