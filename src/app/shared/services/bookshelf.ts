import { Injectable, signal } from '@angular/core';
import { BookInterface } from '../interfaces/book-interface';

export type BookShelfItem = Pick<
  BookInterface,
  'title' | 'author' | 'year' | 'pages' | 'pages_read' | 'rating' | 'portrait_url'
>;

@Injectable({
  providedIn: 'root'
})
export class BookshelfService {
  // señal reactiva que guarda los libros de la estantería
  private _bookshelf = signal<BookShelfItem[]>([]);

  get bookshelvesItems() {
    return this._bookshelf;
  }

  addBook(book: BookShelfItem) {
    this._bookshelf.update(items => [...items, book]);
  }

  removeBook(title: string) {
    this._bookshelf.update(items => items.filter(b => b.title !== title));
  }
}
