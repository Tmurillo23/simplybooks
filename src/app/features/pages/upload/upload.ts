import { Component, ElementRef, HostListener } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {BookInterface} from '../../../shared/interfaces/book-interface';
import {BooksService} from '../../../shared/services/books-service';



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
  searchTerm: string = '';
  books: BookInterface[] = [];
  filteredBooks: BookInterface[] = [];

  constructor(
    private bookService: BooksService,
    private router: Router,
    private eRef: ElementRef
  ) {
    this.books = this.bookService.getBooks();
  }

  // Evento cuando selecciona un archivo
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.showPopup = true;
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
