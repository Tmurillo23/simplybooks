import { Component } from '@angular/core';
import { BooksService } from '../../../shared/services/books-service';
import { ActivatedRoute } from '@angular/router';
import { BookInterface } from '../../../shared/interfaces/book-interface';
import {BookshelfService} from '../../../shared/services/bookshelf';

@Component({
  selector: 'app-book',
  templateUrl: './book.html',
  styleUrl: './book.css'
})
export class Book {
  book?: BookInterface;

  constructor(
    private route: ActivatedRoute,
    private bookService: BooksService,
    private bookshelfService: BookshelfService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.book = this.bookService.getBookById(id);
  }

  addBookToShelf() {
    if (this.book) {
      this.bookshelfService.addBook({
        title: this.book.title,
        author: this.book.author,
        year: this.book.year,
        pages: this.book.pages,
        pages_read: 0,
        rating: 0,
        portrait_url: 'assets/default-cover.jpg'
      });
    }
  }
}
