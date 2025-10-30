import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookInterface } from '../../../shared/interfaces/book-interface';
import { BooksService } from '../../../shared/services/books-service';
import { Auth } from '../../../shared/services/auth';
import { Storage } from '../../../shared/services/storage';
import { BookshelfService } from '../../../shared/services/bookshelf';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SUPABASE_FILES_BUCKET } from '../../../../environments/environment';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.html',
  imports: [FormsModule],
  styleUrl: './upload.css'
})
export class Upload {
  title: string = 'Agregar libros';
  showPopup = false;
  selectedFile: File | null = null;
  fileUsername: string | null = null;
  searchTerm: string = '';
  filteredBooks: BookInterface[] = [];
  isLoading: boolean = false;
  private searchSubject = new Subject<string>();

  storageService = inject(Storage);
  authService = inject(Auth);
  bookshelfService = inject(BookshelfService);

  constructor(
    private bookService: BooksService,
    private router: Router,
    private eRef: ElementRef
  ) {
    // Configura búsqueda con debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  // Genera ID estable basado en la ruta del archivo
  private generateStableId(filePath: string): number {
    let hash = 0;
    for (let i = 0; i < filePath.length; i++) {
      const char = filePath.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  // Evento cuando se selecciona un archivo
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0 && input.files.length < 2) {
      this.selectedFile = input.files[0];
      this.fileUsername = this.authService.getUserLogged().username!;

      try {
        // 1. Subir archivo al bucket
        const filePath = await this.storageService.uploadFile(
          this.selectedFile,
          this.fileUsername,
          SUPABASE_FILES_BUCKET
        );

        if (filePath) {
          const url = this.storageService.getFileUrl(filePath, SUPABASE_FILES_BUCKET);
          const fullName = this.selectedFile!.name;
          const nameWithoutExt = fullName.substring(0, fullName.lastIndexOf('.')) || fullName;
          const stableId = this.generateStableId(filePath);

          // 2. Buscar metadatos en Open Library
          let bookMetadata: Partial<BookInterface> = {};
          try {
            const searchResult = await this.bookService.searchBooks(nameWithoutExt, 1).toPromise();
            if (searchResult && searchResult.books.length > 0) {
              const foundBook = searchResult.books[0];
              bookMetadata = {
                title: foundBook.title,
                author: foundBook.author,
                year: foundBook.year,
                portrait_url: foundBook.portrait_url,
                pages: foundBook.pages,
                description: foundBook.description || `Libro "${foundBook.title}" por ${foundBook.author}`
              };
            }
          } catch (error) {
            console.warn('No se encontraron metadatos:', error);
          }

          // 3. Crear objeto del libro
          const newBook = {
            id: uuidv4(),
            title: bookMetadata.title || nameWithoutExt,
            author: bookMetadata.author || '',
            year: bookMetadata.year || 0,
            portrait_url: bookMetadata.portrait_url || '',
            file_url: url,
            description: bookMetadata.description || `Archivo: ${nameWithoutExt}`,
            rating: 0,
            pages: bookMetadata.pages || 0,
            pages_read: 0,
            reading_status: 'Por leer'
          };

          // 4. Guardar libro (local + backend)
          this.bookshelfService.addBook(newBook).subscribe({
            next: (added) => {
              if (added) {
                Swal.fire({
                  title: "Exitoso",
                  text: "Libro agregado a tu biblioteca",
                  icon: "success"
                });
                this.router.navigate(['/home']);
              } else {
                Swal.fire({
                  title: 'Error',
                  text: 'El libro ya existe en tu biblioteca',
                  icon: 'error'
                });
              }
            },
            error: (err) => {
              console.error('Error al guardar libro:', err);
              Swal.fire('Error', 'No se pudo guardar el libro en el backend', 'error');
            }
          });

        } else {
          Swal.fire('Error!!', 'No se recibió la ruta del archivo', 'error');
        }
      } catch (error) {
        console.error('Upload error:', error);
        Swal.fire('Error!!', error instanceof Error ? error.message : 'Error al subir el archivo', 'error');
      }
    }
  }

  // Agregar libro desde búsqueda (Open Library)
  addBookFromSearch(book: BookInterface) {
    const bookToAdd = {
      id: book.id,
      title: book.title,
      author: book.author,
      year: book.year,
      portrait_url: book.portrait_url,
      file_url: '',
      description: book.description || `Libro "${book.title}" por ${book.author}`,
      rating: 0,
      pages: book.pages,
      pages_read: 0,
      reading_status: 'Por leer'
    };

    this.bookshelfService.addBook(bookToAdd).subscribe({
      next: (added) => {
        if (added) {
          Swal.fire({
            title: "Exitoso",
            text: "Libro agregado a tu biblioteca",
            icon: "success"
          });
          this.filteredBooks = [];
          this.searchTerm = '';
          this.router.navigate(['/home']);
        } else {
          Swal.fire({
            title: 'Atención',
            text: 'Este libro ya está en tu biblioteca',
            icon: 'warning'
          });
        }
      },
      error: (err) => {
        console.error('Error al guardar libro desde búsqueda:', err);
        Swal.fire('Error', 'No se pudo guardar el libro en el backend', 'error');
      }
    });
  }

  // Buscar libros en Open Library
  onSearch() {
    if (this.searchTerm.trim().length > 2) {
      this.searchSubject.next(this.searchTerm);
    } else {
      this.filteredBooks = [];
    }
  }

  private performSearch(searchTerm: string) {
    this.isLoading = true;
    this.bookService.searchBooks(searchTerm, 10).subscribe({
      next: (result) => {
        this.filteredBooks = result.books;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error de búsqueda:', error);
        this.isLoading = false;
        this.filteredBooks = [];
        Swal.fire('Error', 'No se pudo conectar con la base de datos de libros', 'error');
      }
    });
  }

  goToBook(book: BookInterface) {
    this.addBookFromSearch(book);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.filteredBooks = [];
    }
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.filteredBooks = [];
  }
}
