import { Component, OnInit, signal, computed, inject } from '@angular/core';
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
  private reviewService = inject(ReviewService);
  private bookshelfService = inject(BookshelfService);
  private auth = inject(Auth);

  userId!: string;
  reviews = signal<ReviewInterface[]>([]);
  search = signal('');

  filteredReviews = computed(() => {
    const term = this.search().toLowerCase();
    if (!term) return this.reviews();

    return this.reviews().filter(r => {
      const bookTitle = this.getBookTitle(r.bookId).toLowerCase();
      const reviewTitle = r.title?.toLowerCase() || '';
      return bookTitle.includes(term) || reviewTitle.includes(term);
    });
  });

  ngOnInit(): void {
    const user = this.auth.getUserLogged();
    this.userId = user.email;
    this.loadReviews();
  }

  private loadReviews(): void {
    this.reviews.set(this.reviewService.getReviewsForUser(this.userId));
  }

  getBookTitle(bookId: string): string {
    const book = this.bookshelfService.bookshelvesItems.find(b => b.id.toString() === bookId);
    return book ? book.title : 'Título no disponible';
  }

  publish(review: ReviewInterface): void {
    if (review.draft) {
      this.reviewService.publishReview(review.id);
      this.loadReviews();
    }
  }

  delete(review: ReviewInterface): void {
    this.reviewService.deleteReview(review.id);
    this.loadReviews();
  }
}
