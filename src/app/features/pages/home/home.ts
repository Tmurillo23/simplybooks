import { Component, OnInit } from '@angular/core';
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
  constructor(public bookshelfService: BookshelfService) {}

  async ngOnInit() {
    await this.bookshelfService.loadUserFiles(); // Cargar archivos del usuario al inicializar el componente
  }
  
  removeBook(id: number) {
    this.bookshelfService.removeBook(id);
    alert('📚 Libro eliminado de la estantería');
  }

  downloadFile(book: BookShelfItem) {
    if (!book.file_url) {
      Swal.fire('Error', 'No hay archivo para descargar', 'error');
      return;
    }

    // Crear un enlace temporal para descargar el archivo
    const link = document.createElement('a');
    link.href = book.file_url;
    
    // Extraer el nombre del archivo de la URL o usar el titulo del libro
    const fileName = this.getFileNameFromUrl(book.file_url) || `${book.title}.pdf`;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Mostrar confirmacion
    Swal.fire('Descarga iniciada', `Descargando: ${fileName}`, 'info');
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
