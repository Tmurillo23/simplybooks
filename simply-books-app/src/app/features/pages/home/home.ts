import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Auth } from '../../../shared/services/auth';
import { UserService } from '../../../shared/services/user-service';
import { BookShelfItem, BookshelfService } from '../../../shared/services/bookshelf';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [FormsModule, RouterLink]
})
export class Home implements OnInit {
  private bookshelfService = inject(BookshelfService);
  private authService = inject(Auth);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);

  user: any;
  viewingOwnHome = false;

  // 🔹 Buscador reactivo con Signals
  search = signal('');

  // 🔹 Filtrado reactivo
  filteredBooks = computed(() => {
    const term = this.search().toLowerCase();
    if (!term) return this.bookshelfService.bookshelvesItems;
    return this.bookshelfService.bookshelvesItems.filter(book =>
      (book.title?.toLowerCase().includes(term) ||
        book.author?.toLowerCase().includes(term))
    );
  });

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const username = params.get('username');
      const currentUser = this.authService.getUserLogged();

      this.viewingOwnHome = !username || username === currentUser.username;

      if (this.viewingOwnHome) {
        this.user = currentUser;
      } else {
        this.user = await this.userService.findByUsername(username!).toPromise();
      }

      if (!this.user) {
        console.error('❌ No se pudo obtener usuario');
        return;
      }

      console.log('📚 Cargando biblioteca para:', this.user.username);
      await this.bookshelfService.loadUserFiles(this.user.username);
      await this.bookshelfService.loadBooksFromApi();
    });
  }

  removeBook(id: number) {
    if (!this.viewingOwnHome) return; // no permitir borrar si es otro usuario

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
