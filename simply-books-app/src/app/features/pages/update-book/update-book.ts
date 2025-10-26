import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookshelfService } from '../../../shared/services/bookshelf';
import { BookInterface } from '../../../shared/interfaces/book-interface';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.html',
  imports: [FormsModule],
  styleUrls: ['./update-book.css']
})
export class UpdateBook {
  book?: BookInterface;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookshelfService: BookshelfService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.bookshelfService.bookshelvesItems.find(b => b.id === id);
    if (found) {
      this.book = { ...found };
      this.recalculateStatus(); // Inicializar estado
    }
  }

  recalculateStatus() {
    if (!this.book) return;

    if (!this.book.pages_read || this.book.pages_read === 0) {
      this.book.reading_status = 'Por leer';
    } else if (this.book.pages_read >= this.book.pages) {
      this.book.reading_status = 'Leído';
    } else {
      this.book.reading_status = 'Leyendo';
    }
  }

  // Se llama cada vez que el input de páginas leídas cambia
  onPagesReadChange() {
    this.recalculateStatus();
  }

  saveChanges() {
    if (!this.book) return;

    const success = this.bookshelfService.updateBook(this.book);

    if (success) {
      Swal.fire({
        title: "Completado!",
        text: "Libro actualizado con éxito",
        icon: "success"
      }).then(() => {
        this.router.navigate(['/home']);
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Error en la actualización",
        icon: "error"
      });
    }
  }
}
