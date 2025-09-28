import { Component,signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Book} from '../../../shared/interfaces/book'

export type BookShelfItem = Pick<Book, 'name' | 'pages' | 'pages_read' | 'rating' | 'portrait_url'>;


@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [
    FormsModule
  ],
  styleUrl: './home.css'
})
export class Home {
  bookshelvesItems = signal<BookShelfItem[]>([]);

}

