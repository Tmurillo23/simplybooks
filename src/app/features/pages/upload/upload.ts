import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookInterface } from '../../../shared/interfaces/book-interface';
import { BooksService } from '../../../shared/services/books-service';
import { Auth } from '../../../shared/services/auth';
import { Storage } from '../../../shared/services/storage';
import { BookshelfService } from '../../../shared/services/bookshelf';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./upload.css']
})
export class Upload{
  title : string = 'Agregar libros'
  showPopup = false;
  selectedFile: File | null = null;
  fileUsername: string | null = null;
  searchTerm: string = '';
  books: BookInterface[] = [];
  filteredBooks: BookInterface[] = [];

  storageService = inject(Storage);
  authService = inject(Auth);
  bookshelfService = inject(BookshelfService);
  
  constructor(
    private bookService: BooksService,
    private router: Router,
    private eRef: ElementRef
  ) {
    this.books = this.bookService.getBooks();
  }

  // Generar ID estable basado en la ruta del archivo
  private generateStableId(filePath: string): number {
    let hash = 0;
    for (let i = 0; i < filePath.length; i++) {
      const char = filePath.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  // Evento cuando selecciona un archivo
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0 && input.files.length < 2) {

      this.selectedFile = input.files[0];
      this.fileUsername = this.authService.getUserLogged().username!;
      this.storageService.uploadFile(this.selectedFile, this.fileUsername)
        .then(response => {

          if (response && response.data) {
            const fullPath = `${this.fileUsername}/${response.data.path.split('/').pop()}`;
            const url = this.storageService.getFileUrl(fullPath);
            const fullName = this.selectedFile!.name;
            const nameWithoutExt = fullName.substring(0, fullName.lastIndexOf('.')) || fullName;

            const stableId = this.generateStableId(response.data.fullPath);
            
            const newBook = {
              id:  stableId, // ID temporal
              title: nameWithoutExt,
              author: '',
              year: 0,
              portrait_url: '',
              file_url: url,
              description: '',
              rating: 0,
              pages: 0,
              pages_read: 0
            };

            // Agregar al bookshelf
            const added = this.bookshelfService.addBook(newBook);

            if (added) {
              Swal.fire('Exitoso', 'Libro agregado a tu biblioteca', 'success');
              this.router.navigate(['/home']);
            } else {
              Swal.fire('Error', 'El libro ya existe en tu biblioteca', 'error');
            }
          } else if (response) {
            Swal.fire('Error!!')
          }
          
        }
        );
    }
  }

  onSearch() {
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  goToBook(book: BookInterface) {
    this.router.navigate(['/book', book.id]);
    this.filteredBooks = [];
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
