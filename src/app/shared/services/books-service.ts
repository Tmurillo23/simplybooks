import { Injectable } from '@angular/core';
import {BookInterface} from '../interfaces/book-interface';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private books: BookInterface[] = [
    { id: 1, title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', year: 1605, pages:100 },
    { id: 2, title: 'Cien Años de Soledad', author: 'Gabriel García Márquez', year: 1967, pages : 100 },
    { id: 3, title: 'La Ciudad y los Perros', author: 'Mario Vargas Llosa', year: 1963, pages : 100 },
    { id: 4, title: 'Rayuela', author: 'Julio Cortázar', year: 1963, pages : 100 }
  ];

  getBooks(): BookInterface[] {
    return this.books;
  }

  getBookById(id: number): BookInterface | undefined {
    return this.books.find(book => book.id === id);
  }

}
