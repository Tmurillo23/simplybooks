import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookShelfItem, BookshelfService } from '../../../shared/services/bookshelf';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import {BookInterface} from '../../../shared/interfaces/book-interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [FormsModule, RouterLink],
  styleUrl: './home.css'
})
export class Home implements OnInit {
  constructor(public bookshelfService: BookshelfService) {}

  async ngOnInit() {
    await this.bookshelfService.loadUserFiles();
  }

  removeBook(id: number) {
    this.bookshelfService.removeBook(id);

    Swal.fire({
      title: 'Eliminado',
      text: 'Libro eliminado de la estantería',
      icon: 'success'
    });
  }

  downloadFile(book: BookShelfItem) {
    if (!book.file_url) {
      Swal.fire({
        title: 'Error',
        text: 'No hay archivo para descargar',
        icon: 'error'
      });
      return;
    }

    const link = document.createElement('a');
    link.href = book.file_url;

    const fileName = this.getFileNameFromUrl(book.file_url) || `${book.title}.pdf`;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      title: 'Descarga iniciada',
      text: `Descargando: ${fileName}`,
      icon: 'info'
    });
  }




  private getFileNameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[pathParts.length - 1];
    } catch {
      return '';
    }
  }
}
