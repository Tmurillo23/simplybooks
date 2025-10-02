import { Injectable } from '@angular/core';
import {BookInterface} from '../interfaces/book-interface';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private books: BookInterface[] = [
    { id: 1, title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', year: 1605, portrait_url:'public/temporal_assets/600_9789587433913.jpg' , pages:1100 },
    { id: 2, title: 'Cien Años de Soledad', author: 'Gabriel García Márquez', year: 1967, portrait_url :'public/temporal_assets/portada_cien_anos_de_soledad_0.jpg', pages : 471 },
    { id: 3, title: 'La Ciudad y los Perros', author: 'Mario Vargas Llosa', year: 1963, portrait_url:'public/temporal_assets/la_ciudad_y_los_perros.jpg', pages: 448 },
    { id: 4, title: 'Rayuela', author: 'Julio Cortázar', year: 1963, portrait_url: 'public/temporal_assets/Rayuela_JC.png', pages : 730 }
  ];

  getBooks(): BookInterface[] {
    return this.books;
  }

  getBookById(id: number): BookInterface | undefined {
    return this.books.find(book => book.id === id);
  }

}
