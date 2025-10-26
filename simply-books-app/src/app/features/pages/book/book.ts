import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BooksService } from '../../../shared/services/books-service';
import { BookshelfService } from '../../../shared/services/bookshelf';
import { CollectionService } from '../../../shared/services/collections-service';
import { Auth } from '../../../shared/services/auth';
import { BookInterface } from '../../../shared/interfaces/book-interface';
import { CollectionInterface } from '../../../shared/interfaces/collection-interface';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-book',
  templateUrl: './book.html',
  imports: [FormsModule],
  standalone: true,
  styleUrl: './book.css'
})
export class Book implements OnInit {
  book?: BookInterface;
  userCollections: CollectionInterface[] = [];
  selectedCollectionId: string = '';

  private collectionService = inject(CollectionService);
  private authService = inject(Auth);

  constructor(
    private route: ActivatedRoute,
    private bookService: BooksService,
    private bookshelfService: BookshelfService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.book = this.bookService.getBookById(id);

    // Cargar colecciones del usuario
    const user = this.authService.getUserLogged();
    if (user) {
      this.userCollections = this.collectionService.getCollectionsByUser(user);
    }
  }

  isInShelf(): boolean {
    if (!this.book) return false;
    return this.bookshelfService.bookshelvesItems().some(b => b.id === this.book!.id);
  }

  addBookToShelf() {
    if (!this.book) return;
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
    Swal.fire({
      title: 'Éxito',
      text: 'Libro agregado a tu biblioteca',
      icon: 'success'
    });
    this.router.navigate(['/home']);
  }

  /** Agregar libro a una colección del usuario */
  addBookToCollection() {
    if (!this.book || !this.selectedCollectionId) {
      Swal.fire('Error', 'Selecciona una colección válida', 'error');
      return;
    }

    try {
      this.collectionService.addBookToCollection(this.selectedCollectionId, this.book);
      Swal.fire('Éxito', `Libro agregado a la colección correctamente`, 'success');
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    }
  }
}
