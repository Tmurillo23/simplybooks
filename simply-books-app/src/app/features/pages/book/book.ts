import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { BooksService } from '../../../shared/services/books-service';
import { BookshelfService } from '../../../shared/services/bookshelf';
import { CollectionService } from '../../../shared/services/collections-service';
import { Auth } from '../../../shared/services/auth';
import { BookShelfItem } from '../../../shared/services/bookshelf';
import { CollectionInterface } from '../../../shared/interfaces/collection-interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book.html',
  styleUrl: './book.css',
})
export class Book implements OnInit, OnDestroy {
  book?: BookShelfItem;
  userCollections: CollectionInterface[] = [];
  selectedCollectionId: string = '';
  isLoading: boolean = true;
  currentBooks: BookShelfItem[] = [];

  destroy$ = new Subject<void>();
  route = inject(ActivatedRoute);
  router = inject(Router);
   authService = inject(Auth);
   collectionService = inject(CollectionService);
   bookshelfService = inject(BookshelfService);
   booksService = inject(BooksService);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      console.error('❌ No se proporcionó ID de libro');
      this.router.navigate(['/home']);
      return;
    }

    this.bookshelfService.bookshelf
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (books) => {
          this.currentBooks = books;
          this.book = books.find((b) => b.id === id);
          this.isLoading = false;

          if (!this.book) {
            console.warn('⚠️ Libro no encontrado en bookshelf');
            this.loadBookFromBackend(id);
          }
        },
        error: (err) => {
          console.error('❌ Error cargando libros:', err);
          this.isLoading = false;
        }
      });

    const user = this.authService.getUserLogged();
    if (user) {
      this.userCollections = this.collectionService.getCollectionsByUser(user);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBookFromBackend(bookId: string) {
    const user = this.authService.getUserLogged();
    if (!user?.id) return;

    this.booksService.getBooksByUserId(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (books) => {
          this.book = books.find((b) => b.id === bookId);
          if (!this.book) {
            Swal.fire({
              title: 'Error',
              text: 'Libro no encontrado',
              icon: 'error',
            }).then(() => {
              this.router.navigate(['/home']);
            });
          }
        },
        error: (err) => {
          console.error('❌ Error buscando libro en backend:', err);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo cargar el libro',
            icon: 'error',
          }).then(() => {
            this.router.navigate(['/home']);
          });
        }
      });
  }

  isInShelf(): boolean {
    if (!this.book) return false;

    return this.currentBooks.some((b) =>
      b.id === this.book!.id ||
      (b.title === this.book!.title && b.author === this.book!.author)
    );
  }

  addBookToShelf() {
    if (!this.book) return;

    if (this.isInShelf()) {
      Swal.fire({
        title: 'Atención',
        text: 'Este libro ya está en tu biblioteca',
        icon: 'warning',
      });
      return;
    }

    const user = this.authService.getUserLogged();
    if (!user?.id) {
      Swal.fire({
        title: 'Error',
        text: 'Debes iniciar sesión para agregar libros',
        icon: 'error',
      });
      return;
    }

    const bookToAdd: BookShelfItem = {
      ...this.book,
      userId: user.id
    };

    this.bookshelfService.addBook(bookToAdd)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (added) => {
          if (added) {
            Swal.fire({
              title: 'Éxito',
              text: 'Libro agregado a tu biblioteca 📚',
              icon: 'success',
            });
            this.router.navigate(['/home']);
          } else {
            Swal.fire({
              title: 'Atención',
              text: 'Este libro ya está en tu biblioteca',
              icon: 'warning',
            });
          }
        },
        error: (err) => {
          console.error('❌ Error al agregar libro:', err);

          if (err.message === 'BOOK_ALREADY_EXISTS') {
            Swal.fire({
              title: 'Atención',
              text: 'Este libro ya está en tu biblioteca',
              icon: 'warning',
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo agregar el libro. Intenta de nuevo más tarde.',
              icon: 'error',
            });
          }
        },
      });
  }

  addBookToCollection() {
    if (!this.book || !this.selectedCollectionId) {
      Swal.fire('Error', 'Selecciona una colección válida', 'error');
      return;
    }

    try {
      this.collectionService.addBookToCollection(this.selectedCollectionId, this.book);
      Swal.fire('Éxito', 'Libro agregado a la colección correctamente', 'success');
    } catch (error: any) {
      Swal.fire('Error', error.message || 'No se pudo agregar el libro.', 'error');
    }
  }

  getBookCover(): string {
    return this.book?.portrait_url || this.book?.cover || 'assets/default-book-cover.png';
  }

  getReadingProgress(): number {
    if (!this.book?.pages || !this.book?.pages_read) return 0;
    return Math.round((this.book.pages_read / this.book.pages) * 100);
  }

  // ✅ CORREGIDO: Actualiza solo el progreso
  updateReadingProgress(pages: number) {
    if (!this.book || !this.book.id) {
      console.error('❌ No hay libro para actualizar');
      return;
    }

    console.log(`📖 Actualizando progreso: ${pages} páginas leídas de ${this.book.pages}`);

    const updatedBook: BookShelfItem = {
      ...this.book,
      pages_read: pages
    };

    console.log('📤 Enviando libro actualizado al backend:', updatedBook);

    this.bookshelfService.updateBook(updatedBook)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          console.log('✅ Respuesta del backend:', success);

          if (success) {
            // Actualizar el libro local inmediatamente
            if (this.book) {
              this.book.pages_read = pages;
            }

            Swal.fire({
              title: 'Éxito',
              text: `Progreso actualizado: ${pages} páginas`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          } else {
            console.error('❌ El backend retornó false');
            Swal.fire({
              title: 'Error',
              text: 'No se pudo actualizar el progreso',
              icon: 'error',
            });
          }
        },
        error: (err) => {
          console.error('❌ Error actualizando progreso:', err);
          console.error('Detalles del error:', {
            message: err.message,
            status: err.status,
            error: err.error
          });

          Swal.fire({
            title: 'Error',
            text: err.error?.message || 'No se pudo actualizar el progreso',
            icon: 'error',
          });
        }
      });
  }

  // ✅ CORREGIDO: Actualiza solo el estado
  updateReadingStatus(status: string) {
    if (!this.book || !this.book.id) {
      console.error('❌ No hay libro para actualizar');
      return;
    }

    console.log(`📚 Actualizando estado a: ${status}`);

    const updatedBook: BookShelfItem = {
      ...this.book,
      reading_status: status
    };

    console.log('📤 Enviando libro actualizado al backend:', updatedBook);

    this.bookshelfService.updateBook(updatedBook)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          console.log('✅ Respuesta del backend:', success);

          if (success) {
            // Actualizar el libro local inmediatamente
            if (this.book) {
              this.book.reading_status = status;
            }

            Swal.fire({
              title: 'Éxito',
              text: `Estado actualizado: ${status}`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          } else {
            console.error('❌ El backend retornó false');
            Swal.fire({
              title: 'Error',
              text: 'No se pudo actualizar el estado',
              icon: 'error',
            });
          }
        },
        error: (err) => {
          console.error('❌ Error actualizando estado:', err);
          console.error('Detalles del error:', {
            message: err.message,
            status: err.status,
            error: err.error
          });

          Swal.fire({
            title: 'Error',
            text: err.error?.message || 'No se pudo actualizar el estado',
            icon: 'error',
          });
        }
      });
  }

  // ✅ CORREGIDO: Actualiza solo la calificación
  updateRating(rating: number) {
    if (!this.book || !this.book.id) {
      console.error('❌ No hay libro para actualizar');
      return;
    }

    console.log(`⭐ Actualizando calificación a: ${rating}`);

    const updatedBook: BookShelfItem = {
      ...this.book,
      rating: rating
    };

    console.log('📤 Enviando libro actualizado al backend:', updatedBook);

    this.bookshelfService.updateBook(updatedBook)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          console.log('✅ Respuesta del backend:', success);

          if (success) {
            // Actualizar el libro local inmediatamente
            if (this.book) {
              this.book.rating = rating;
            }

            Swal.fire({
              title: 'Éxito',
              text: `Calificación: ${rating} estrellas`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          } else {
            console.error('❌ El backend retornó false');
            Swal.fire({
              title: 'Error',
              text: 'No se pudo actualizar la calificación',
              icon: 'error',
            });
          }
        },
        error: (err) => {
          console.error('❌ Error actualizando calificación:', err);
          console.error('Detalles del error:', {
            message: err.message,
            status: err.status,
            error: err.error
          });

          Swal.fire({
            title: 'Error',
            text: err.error?.message || 'No se pudo actualizar la calificación',
            icon: 'error',
          });
        }
      });
  }

  // ✅ NUEVO: Método para eliminar libro
  deleteBook() {
    if (!this.book || !this.book.id) return;

    Swal.fire({
      title: '¿Eliminar libro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && this.book?.id) {
        console.log(`🗑️ Eliminando libro: ${this.book.id}`);

        this.bookshelfService.deleteBook(this.book.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (success) => {
              console.log('✅ Respuesta del backend:', success);

              if (success) {
                Swal.fire({
                  title: 'Eliminado',
                  text: 'El libro ha sido eliminado',
                  icon: 'success',
                  timer: 1500,
                  showConfirmButton: false
                });
                this.router.navigate(['/home']);
              } else {
                Swal.fire({
                  title: 'Error',
                  text: 'No se pudo eliminar el libro',
                  icon: 'error',
                });
              }
            },
            error: (err) => {
              console.error('❌ Error eliminando libro:', err);
              Swal.fire({
                title: 'Error',
                text: err.error?.message || 'No se pudo eliminar el libro',
                icon: 'error',
              });
            }
          });
      }
    });
  }
}
