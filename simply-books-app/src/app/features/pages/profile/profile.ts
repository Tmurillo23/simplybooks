import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../shared/services/auth';
import { ReviewService } from '../../../shared/services/review-service';
import { BookshelfService, BookShelfItem } from '../../../shared/services/bookshelf';
import { ReviewInterface } from '../../../shared/interfaces/review-interface';
import { CollectionInterface } from '../../../shared/interfaces/collection-interface';
import {CollectionService} from '../../../shared/services/collections-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  private authService = inject(Auth);
  private reviewService = inject(ReviewService);
  private collectionService = inject(CollectionService);
  private bookshelfService = inject(BookshelfService);

  user = this.authService.getUserLogged();

  stats = {
    booksRead: this.user.stats?.booksRead || 0,
    reviewsCount: 0,
    followersCount: this.user.stats?.followersCount || 0,
    followingCount: this.user.stats?.followingCount || 0
  };

  recentReviews: ReviewInterface[] = [];
  recentLibrary: BookShelfItem[] = [];
  recentCollections: CollectionInterface[] = [];

  async ngOnInit() {
    await this.loadLibrary();
    this.loadReviews();
    this.loadCollections();
  }

  /** Últimas 5 reseñas publicadas */
  private loadReviews() {
    const reviews = this.reviewService
      .getReviewsForUser(this.user.email)
      .filter(r => !r.draft);
    this.recentReviews = [...reviews].slice(-5).reverse();
    this.stats.reviewsCount = reviews.length;
  }

  /** Últimos 5 libros agregados a la librería personal */
  private async loadLibrary() {
    await this.bookshelfService.loadUserFiles();
    const allBooks = this.bookshelfService.bookshelvesItems;
    this.recentLibrary = [...allBooks].slice(-5).reverse();
  }

  /** Últimas 5 colecciones creadas */
  private loadCollections() {
    const collections = this.collectionService.getCollectionsByUser(this.user);
    this.recentCollections = [...collections].slice(-5).reverse();
  }

  /** Enlaces principales (clic en el título del bloque) */
  goTo(type: string): any[] {
    switch (type) {
      case 'library': return ['/home', this.user.username];
      case 'reviews': return ['/reviews', this.user.username];
      case 'collections': return ['/collections', this.user.username];
      default: return ['/'];
    }
  }

  /** Enlace al ítem específico */
  goToItem(type: string, id: any): any[] {
    switch (type) {
      case 'library': return ['/book', id];
      case 'reviews': return ['/review', id];
      case 'collections': return ['/collection', id];
      default: return ['/'];
    }
  }
}
