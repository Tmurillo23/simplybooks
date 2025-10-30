import {Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ReviewService } from '../../../shared/services/review-service';
import { BookshelfService } from '../../../shared/services/bookshelf';
import { ReviewInterface } from '../../../shared/interfaces/review-interface';
import { BookShelfItem } from '../../../shared/services/bookshelf';
import { TINYMCE_KEY } from '../../../../environments/environment';
import {Auth} from '../../../shared/services/auth';
import {User} from '../../../shared/interfaces/user';


@Component({
  selector: 'app-edit-review',
  standalone: true,
  imports: [ FormsModule, RouterLink, EditorModule],
  templateUrl: './edit-review.html',
  styleUrls: ['./edit-review.css']
})
export class EditReview implements OnInit {
  reviewId: string = '';
  review?: ReviewInterface;
  authService = inject(Auth)
  user: User = this.authService.getUserLogged();

  title = '';
  content = '';
  rating = 0;
  draft = false;
  selectedBookId = '';
  availableBooks: BookShelfItem[] = [];
  tinyMCEApiKey = TINYMCE_KEY;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private bookshelfService: BookshelfService
  ) {}

  ngOnInit() {
    this.reviewId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.reviewId) {
      console.error('No se proporciono ID de reseña');
      return;
    }

    // Cargar reseña existente
    const found = this.reviewService.getReviewById(this.reviewId);
    if (!found) {
      console.error('Reseña no encontrada');
      return;
    }

    this.review = found;
    this.title = found.title;
    this.content = found.content;
    this.rating = found.rating;
    this.draft = !!found.draft;
    this.selectedBookId = found.bookId;

    // Cargar libros disponibles del usuario
    this.bookshelfService.loadUserFiles(this.user);
    this.availableBooks = this.bookshelfService.availableBooks;
  }

  updateReview() {
    if (!this.reviewId) return;

    this.reviewService.updateReview(this.reviewId, {
      title: this.title,
      content: this.content,
      rating: this.rating,
      draft: this.draft
    });

    alert('Reseña actualizada correctamente');
    this.router.navigate(['/reviews']);
  }

}
