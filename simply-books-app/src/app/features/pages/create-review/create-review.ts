import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReviewService } from '../../../shared/services/review-service';
import { BookshelfService, BookShelfItem } from '../../../shared/services/bookshelf';
import { Auth } from '../../../shared/services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.html',
  styleUrls: ['./create-review.css'],
  imports: [RouterLink, FormsModule]
})
export class CreateReview implements OnInit {
  availableBooks: BookShelfItem[] = [];
  selectedBookId: string | null = null;
  title = '';
  content = '';
  rating = 0;

  userId!: string;

  constructor(
    private reviewService: ReviewService,
    private bookshelfService: BookshelfService,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    const user = this.auth.getUserLogged();
    this.userId = user.email;

    // Solo libros que no sean archivos (sin file_url)
    this.availableBooks = this.bookshelfService.bookshelvesItems.filter(book => !book.file_url);
  }

  saveDraft(): void {
    this.saveReview(true);
  }

  publishReview(): void {
    this.saveReview(false);
  }

  private saveReview(draft: boolean): void {
    if (!this.selectedBookId) {
      alert('Selecciona un libro');
      return;
    }

    if (!this.title.trim()) {
      alert('Escribe un título para tu reseña');
      return;
    }

    if (!this.content.trim()) {
      alert('Escribe el contenido de la reseña');
      return;
    }

    if (this.rating < 1 || this.rating > 5) {
      alert('La calificación debe estar entre 1 y 5');
      return;
    }

    this.reviewService.addReview({
      title: this.title,
      bookId: this.selectedBookId,
      userId: this.userId,
      content: this.content,
      rating: this.rating,
      draft : draft,
    });


    alert(draft ? 'Reseña guardada como borrador' : 'Reseña publicada');
    this.resetForm();
  }

  private resetForm() {
    this.selectedBookId = null;
    this.title = '';
    this.content = '';
    this.rating = 0;
  }
}
