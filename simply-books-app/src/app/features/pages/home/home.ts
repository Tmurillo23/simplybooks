import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookShelfItem, BookshelfService } from '../../../shared/services/bookshelf';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [FormsModule, RouterLink],
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private bookshelfService = inject(BookshelfService);

  // 🔹 Buscador reactivo con Signals
  search = signal('');

  // 🔹 Filtrado de libros en la estantería del usuario
  filteredBooks = computed(() => {
    const term = this.search().toLowerCase();
    if (!term) return this.bookshelfService.bookshelvesItems;
    return this.bookshelfService.bookshelvesItems.filter(book =>
      (book.title?.toLowerCase().includes(term) ||
        book.author?.toLowerCase().includes(term))
    );
  });

  async ngOnInit() {
    await this.bookshelfService.loadUserFiles(); // Archivos de usuario
    await this.bookshelfService.loadBooksFromApi(); // Libros de la API
  }


  removeBook(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El libro se eliminará de tu biblioteca',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookshelfService.removeBook(id);
        Swal.fire({
          title: 'Eliminado',
          text: 'Libro eliminado de la estantería',
          icon: 'success',
          timer: 2000
        });
      }
    });
  }

  downloadFile(book: BookShelfItem) {
    if (!book.file_url) {
      Swal.fire({
        title: 'Error',
        text: 'Este libro no tiene archivo para descargar',
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
      icon: 'info',
      timer: 2000
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
