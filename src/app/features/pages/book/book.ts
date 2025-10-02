import { Component } from '@angular/core';
import { BooksService } from '../../../shared/services/books-service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookInterface } from '../../../shared/interfaces/book-interface';
import { BookshelfService } from '../../../shared/services/bookshelf';

@Component({
  selector: 'app-book',
  templateUrl: './book.html',
  styleUrl: './book.css'
})
export class Book {
  book?: BookInterface;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BooksService,
    private bookshelfService: BookshelfService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.book = this.bookService.getBookById(id);
  }

  addBookToShelf() {
    if (this.book) {
      const added = this.bookshelfService.addBook({
        id: this.book.id,
        title: this.book.title,
        author: this.book.author,
        year: this.book.year,
        pages: this.book.pages,
        pages_read: this.book.pages_read ?? 0,
        rating: this.book.rating ?? 0,
        portrait_url: this.book.portrait_url ?? 'assets/default-cover.jpg',
        description: this.book.description ?? ''
      });

      if (added) {
        alert('✅ Libro agregado con éxito a tu estantería');
        this.router.navigate(['/home']);
      } else {
        alert(' El libro ya está en tu estantería');
      }
    }
  }
}
