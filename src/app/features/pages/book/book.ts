import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '../../../shared/services/books-service';
import { BookshelfService } from '../../../shared/services/bookshelf';
import { BookInterface } from '../../../shared/interfaces/book-interface';

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
    private bookshelfService: BookshelfService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.book = this.bookService.getBookById(id);
  }

  isInShelf(): boolean {
    if (!this.book) return false;
    return this.bookshelfService.bookshelvesItems().some(b => b.id === this.book!.id);
  }

  addBookToShelf() {
    if (this.book) {
      this.bookshelfService.addBook({
        id: this.book.id,
        title: this.book.title,
        author: this.book.author,
        year: this.book.year,
        pages: this.book.pages,
        pages_read: this.book.pages_read || 0,
        rating: this.book.rating || 0,
        portrait_url: this.book.portrait_url || 'assets/default-cover.png',
        description: this.book.description || ''
      });
      alert('✅ Libro agregado con éxito');
      this.router.navigate(['/home']);
    }
  }
}
