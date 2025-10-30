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
    const id = (this.route.snapshot.paramMap.get('id'));

    // En la estanderia de libros, buscamos un libro.
    this.book = this.bookshelfService.bookshelvesItems.find(b => b.id === id);

    // Si no se encuentra en la estanderia, informamos
    // Obtenemos los detalles de la estanteria.
    if (!this.book) {
      console.warn('El libro no se encontro');
    }

    const user = this.authService.getUserLogged();
    if (user) {
      this.userCollections = this.collectionService.getCollectionsByUser(user);
    }
  }

  isInShelf(): boolean {
    if (!this.book) return false;
    return this.bookshelfService.bookshelvesItems.some(b => b.id === this.book!.id);
  }

  addBookToShelf() {
    if (!this.book) return;

    const bookToAdd = {
      id: this.book.id,
      title: this.book.title,
      author: this.book.author,
      year: this.book.year,
      pages: this.book.pages,
      pages_read: this.book.pages_read || 0,
      rating: this.book.rating || 0,
      portrait_url: this.book.portrait_url || 'assets/default-cover.png',
      description: this.book.description || '',
      reading_status: this.book.reading_status || 'Por leer'
    };

    this.bookshelfService.addBook(bookToAdd).subscribe({
      next: (added) => {
        if (added) {
          Swal.fire({
            title: 'Exito',
            text: 'Libro agregado a tu biblioteca',
            icon: 'success'
          });
          this.router.navigate(['/home']);
        } else {
          Swal.fire({
            title: 'Atencion',
            text: 'Este libro ya está en tu biblioteca',
            icon: 'warning'
          });
        }
      },
      error: (err) => {
        console.error('Error al agregar libro:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo agregar el libro. Intenta de nuevo más tarde.',
          icon: 'error'
        });
      }
    });
  }


  addBookToCollection() {
    if (!this.book || !this.selectedCollectionId) {
      Swal.fire('Error', 'Selecciona una colección valida', 'error');
      return;
    }

    try {
      this.collectionService.addBookToCollection(this.selectedCollectionId, this.book);
      Swal.fire('Exito', `Libro agregado a la coleccion correctamente`, 'success');
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    }
  }
}