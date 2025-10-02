import { Injectable, signal } from '@angular/core';
import { BookInterface } from '../interfaces/book-interface';

export type BookShelfItem = Pick<
  BookInterface,
  'id' | 'title' | 'author' | 'year' | 'portrait_url' | 'description' | 'rating' | 'pages' | 'pages_read'
>;

@Injectable({
  providedIn: 'root'
})
export class BookshelfService {
  private _bookshelf = signal<BookShelfItem[]>([]);

  get bookshelvesItems() {
    return this._bookshelf;
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
    // 🔎 Validaciones
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

    return true; // ✅ actualización exitosa
  }

  removeBook(id: number) {
    this._bookshelf.update(items => items.filter(b => b.id !== id));
  }
}
