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

@Component({
  selector: 'app-upload',
  templateUrl: './upload.html',
  imports: [
    FormsModule
  ],
  styleUrl: './upload.css'
})
export class Upload {
  title: string = 'Agregar libros'
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
    // Setup search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  // Generate stable ID based on file path
  private generateStableId(filePath: string): number {
    let hash = 0;
    for (let i = 0; i < filePath.length; i++) {
      const char = filePath.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  // Event when file is selected
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0 && input.files.length < 2) {
      this.selectedFile = input.files[0];
      this.fileUsername = this.authService.getUserLogged().username!;
      
      try {
        const response = await this.storageService.uploadFile(this.selectedFile, this.fileUsername);
        
        if (response && response.data) {
          const fullPath = `${this.fileUsername}/${response.data.path.split('/').pop()}`;
          const url = this.storageService.getFileUrl(fullPath);
          const fullName = this.selectedFile!.name;
          const nameWithoutExt = fullName.substring(0, fullName.lastIndexOf('.')) || fullName;

          const stableId = this.generateStableId(response.data.fullPath);

          // Try to find book metadata from Open Library
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
                pages: foundBook.pages
              };
            }
          } catch (error) {
            console.warn('Could not find book metadata:', error);
          }

          const newBook = {
            id: stableId,
            title: bookMetadata.title || nameWithoutExt,
            author: bookMetadata.author || '',
            year: bookMetadata.year || 0,
            portrait_url: bookMetadata.portrait_url || '',
            file_url: url,
            description: '',
            rating: 0,
            pages: bookMetadata.pages || 0,
            pages_read: 0,
            reading_status: 'Por leer'
          };

          // Add to bookshelf
          const added = this.bookshelfService.addBook(newBook);

          if (added) {
            Swal.fire({
              title: "Exitoso",
              text: "Libro agregado a tu biblioteca",
              icon: "success"
            });
            this.router.navigate(['/home']);
          } else {
            Swal.fire({ title: 'Error', text: 'El libro ya existe en tu biblioteca', icon: 'error' });
          }
        } else if (response) {
          Swal.fire('Error!!', 'Error al subir el archivo', 'error');
        }
      } catch (error) {
        console.error('Upload error:', error);
        Swal.fire('Error!!', 'Error al subir el archivo', 'error');
      }
    }
  }

  // Search for books in Open Library
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
        console.error('Search error:', error);
        this.isLoading = false;
        // Show empty results if API fails
        this.filteredBooks = [];
        Swal.fire('Error', 'No se pudo conectar con la base de datos de libros', 'error');
      }
    });
  }

  // Add book from Open Library search to bookshelf
  addBookFromSearch(book: BookInterface) {
    const bookToAdd = {
      id: book.id,
      title: book.title,
      author: book.author,
      year: book.year,
      portrait_url: book.portrait_url,
      file_url: '', // No file URL for Open Library books
      description: '',
      rating: 0,
      pages: book.pages,
      pages_read: 0,
      reading_status: 'Por leer'
    };

    const added = this.bookshelfService.addBook(bookToAdd);

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
      Swal.fire({ title: 'Atención', text: 'Este libro ya está en tu biblioteca', icon: 'warning' });
    }
  }

  goToBook(book: BookInterface) {
    // For Open Library books, we don't have a detail page yet
    // So we'll just add them to the bookshelf directly
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