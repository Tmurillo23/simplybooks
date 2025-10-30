import { Component, ElementRef, HostListener, inject, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BookshelfService, BookShelfItem } from '../../../shared/services/bookshelf';
import { Auth } from '../../../shared/services/auth';
import { User } from '../../../shared/interfaces/user';
import { CollectionService } from '../../../shared/services/collections-service';

@Component({
  selector: 'app-create-collection',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-collection.html',
  styleUrls: ['./create-collection.css']
})
export class CreateCollection implements OnInit {

  name: string = '';
  description: string = '';
  image_url: string = '';

  searchTerm: string = '';
  filteredBooks: BookShelfItem[] = [];
  selectedBooks: BookShelfItem[] = [];

  private collectionService = inject(CollectionService);
  private bookshelfService = inject(BookshelfService);
  private authService = inject(Auth);
  private router = inject(Router);
  private eRef = inject(ElementRef);
  user : User = this.authService.getUserLogged();

  // Computed para obtener libros actuales del signal
  private currentCollectionId: string | null = null;

  async ngOnInit() {
    // Cargar libros del usuario si no están aún
    await this.bookshelfService.loadUserFiles(this.user);
  }

  /** Buscar libros por título */
  onSearch() {
    const books = this.bookshelfService.bookshelvesItems; // ⚠ ya es un array
    this.filteredBooks = books.filter(book =>
      book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      !this.selectedBooks.some(selected => selected.id === book.id)
    );
  }



  /** Agregar libro a la colección usando CollectionService */
  addBook(book: BookShelfItem) {
    if (!this.currentCollectionId) {
      // Todavía no se creó la colección: agregamos a la lista local
      this.selectedBooks.push(book);
    } else {
      try {
        this.collectionService.addBookToCollection(this.currentCollectionId, book);
      } catch (error: any) {
        alert(error.message);
      }
    }
    this.filteredBooks = [];
    this.searchTerm = '';
  }

  /** Eliminar libro de la colección usando CollectionService */
  removeBook(book: BookShelfItem) {
    if (!this.currentCollectionId) {
      // Antes de crear la colección, solo eliminar de la lista local
      this.selectedBooks = this.selectedBooks.filter(b => b.id !== book.id);
    } else {
      try {
        this.collectionService.removeBookFromCollection(this.currentCollectionId, book.id);
      } catch (error: any) {
        alert(error.message);
      }
    }
  }

  /** Crear colección usando CollectionService */
  createCollection() {
    const user: User | null = this.authService.getUserLogged();

    if (!user) {
      Swal.fire({ title: 'Error', text: 'Debes iniciar sesión para crear una colección.', icon: 'error' });
      return;
    }

    if (!this.name.trim()) {
      Swal.fire({ title: 'Error', text: 'El nombre de la colección es obligatorio.', icon: 'error' });
      return;
    }

    try {
      // Crear colección
      const newCollection = this.collectionService.createCollection(
        user,
        this.name,
        this.description,
      );

      this.currentCollectionId = newCollection.id;

      // Agregar libros seleccionados usando CollectionService
      for (const book of this.selectedBooks) {
        this.collectionService.addBookToCollection(newCollection.id, book);
      }

      Swal.fire({
        title: 'Éxito',
        text: 'Colección creada correctamente.',
        icon: 'success'
      }).then(() => this.router.navigate(['/collections']));

    } catch (error: any) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error' });
    }
  }

  /** Cerrar dropdown cuando se hace clic afuera */
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.filteredBooks = [];
    }
  }

  /** Cerrar dropdown al presionar Escape */
  @HostListener('document:keydown.escape')
  handleEscape() {
    this.filteredBooks = [];
  }
}
