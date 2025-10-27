import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ReviewService } from '../../../shared/services/review-service';
import { BookshelfService, BookShelfItem } from '../../../shared/services/bookshelf';
import { Auth } from '../../../shared/services/auth';
import { TINYMCE_KEY } from '../../../../environments/environment';


@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.html',
  styleUrls: ['./create-review.css'],
  imports: [FormsModule, EditorModule]
})
export class CreateReview implements OnInit {
  availableBooks: BookShelfItem[] = [];
  selectedBookId: string | null = null;
  title = '';
  content = '';
  rating = 0;
  userId!: string;
  tinyMCEApiKey = TINYMCE_KEY;


  constructor(
    private reviewService: ReviewService,
    private bookshelfService: BookshelfService,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    const user = this.auth.getUserLogged();
    this.userId = user.email;
    this.availableBooks = this.bookshelfService.bookshelvesItems.filter(book => !book.file_url);
  }

  saveDraft(): void { this.saveReview(true); }
  publishReview(): void { this.saveReview(false); }

  private saveReview(draft: boolean): void {
    if (!this.selectedBookId || !this.title.trim() || !this.content.trim() || this.rating < 1 || this.rating > 5) {
      alert('Completa todos los campos correctamente');
      return;
    }

    this.reviewService.addReview({
      title: this.title,
      bookId: this.selectedBookId,
      userId: this.userId,
      content: this.content,
      rating: this.rating,
      draft,
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
