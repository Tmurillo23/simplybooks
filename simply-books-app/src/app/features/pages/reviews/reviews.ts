import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../../shared/services/review-service';
import { ReviewInterface } from '../../../shared/interfaces/review-interface';
import { BookshelfService } from '../../../shared/services/bookshelf';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../shared/services/auth';

@Component({
  selector: 'app-reviews',
  imports: [RouterLink],
  templateUrl: './reviews.html',
  styleUrls: ['./reviews.css']
})
export class Reviews implements OnInit {
  userId!: string;
  reviews: ReviewInterface[] = [];

  constructor(
    private reviewService: ReviewService,
    private bookshelfService: BookshelfService,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    const user = this.auth.getUserLogged();
    this.userId = user.email;
    this.loadReviews();
  }

  private loadReviews(): void {
    this.reviews = this.reviewService.getReviewsForUser(this.userId);
  }

  /** 🔹 Obtener el título del libro desde el bookshelf */
  getBookTitle(bookId: string): string {
    const book = this.bookshelfService.bookshelvesItems.find(b => b.id.toString() === bookId);
    return book ? book.title : 'Título no disponible';
  }

  // 🔹 Publicar borrador
  publish(review: ReviewInterface): void {
    if (review.draft) {
      this.reviewService.publishReview(review.id);
      this.loadReviews();
    }
  }

  // 🔹 Eliminar reseña
  delete(review: ReviewInterface): void {
    this.reviewService.deleteReview(review.id);
    this.loadReviews();
  }
}
