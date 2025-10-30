import {Component, computed, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../shared/services/auth';
import { ReviewService } from '../../../shared/services/review-service';
import { BookshelfService, BookShelfItem } from '../../../shared/services/bookshelf';
import { ReviewInterface } from '../../../shared/interfaces/review-interface';
import { CollectionInterface } from '../../../shared/interfaces/collection-interface';
import { CollectionService } from '../../../shared/services/collections-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  authService = inject(Auth);
  reviewService = inject(ReviewService);
  collectionService = inject(CollectionService);
  bookshelfService = inject(BookshelfService);

  user = computed(() => this.authService.currentUser() || this.authService.getUserLogged());

  stats = computed(() => {
    const user = this.user();
    return {
      booksRead: user.stats?.booksRead || 0,
      reviewsCount: 0, // Esto se actualizará en loadReviews
      followersCount: user.stats?.followersCount || 0,
      followingCount: user.stats?.followingCount || 0
    };
  });

  recentReviews: ReviewInterface[] = [];
  recentLibrary: BookShelfItem[] = [];
  recentCollections: CollectionInterface[] = [];

  async ngOnInit() {
    console.log('🔍 Usuario actual:', this.user());

    if (!this.user() || this.user().username === 'unknown-user') {
      console.warn('Usuario no autenticado o token inválido');
      return;
    }

    await this.loadLibrary();
    this.loadReviews();
    this.loadCollections();
  }
  loadReviews() {
    const user = this.user();
    if (!user?.email) return;

    const reviews = this.reviewService
      .getReviewsForUser(user.email)
      .filter(r => !r.draft);

    this.recentReviews = [...reviews].slice(-5).reverse();
    // Actualizar stats
    this.stats().reviewsCount = reviews.length;
  }

  /** Últimos 5 libros agregados a la librería personal */
  async loadLibrary() {
    await this.bookshelfService.loadUserFiles();
    const allBooks = this.bookshelfService.bookshelvesItems;
    this.recentLibrary = [...allBooks].slice(-5).reverse();
  }

  /** Últimas 5 colecciones creadas */
  private loadCollections() {
    const user = this.user();
    if (!user) return;

    const collections = this.collectionService.getCollectionsByUser(user);
    this.recentCollections = [...collections].slice(-5).reverse();
  }

  /** Enlaces principales (clic en el título del bloque) */
  goTo(type: string): any[] {
    const username = this.user()?.username || 'unknown-user';
    switch (type) {
      case 'library': return ['/home', username];
      case 'reviews': return ['/reviews', username];
      case 'collections': return ['/collections', username];
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
