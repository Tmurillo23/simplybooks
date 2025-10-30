import { Injectable, inject } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { ReviewInterface } from '../interfaces/review-interface';
import { SocialFeedService } from './social-feed-service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviews: ReviewInterface[] = [];
  socialFeedService = inject(SocialFeedService);

  constructor() {}

  /**
   * Crear una nueva reseña.
   * Si no se especifica, se guarda como borrador por defecto.
   * Si se crea ya publicada, también se añade automáticamente al feed social.
   */
  addReview(
    reviewData: Omit<
      ReviewInterface,
      'id' | 'likes' | 'comments' | 'createdAt' | 'updatedAt'
    >
  ): ReviewInterface {
    const review: ReviewInterface = {
      ...reviewData,
      id: uuid(),
      draft: reviewData.draft ?? true,
      likes: 0,
      comments: 0,
      createdAt: new Date()
    };

    this.reviews.push(review);

    // 🔹 Si la reseña se publica directamente (no es borrador),
    // creamos el post automáticamente
    if (!review.draft) {
      this.socialFeedService.createReviewPost(review);
    }

    return review;
  }

  /**
   * Publicar una reseña borrador.
   */
  publishReview(reviewId: string): void {
    const review = this.reviews.find(r => r.id === reviewId && r.draft);
    if (review) {
      review.draft = false;
      review.updatedAt = new Date();

      // 🔹 Al publicarse, también se crea el post correspondiente
      this.socialFeedService.createReviewPost(review);
    } else {
      console.warn('No se puede publicar: reseña no encontrada o ya publicada.');
    }
  }

  /** Eliminar una reseña */
  deleteReview(reviewId: string): void {
    this.reviews = this.reviews.filter(r => r.id !== reviewId);
  }

  /** Obtener reseñas por libro */
  getReviewsForBook(bookId: string): ReviewInterface[] {
    return this.reviews.filter(r => r.bookId === bookId);
  }

  /** Obtener reseñas por usuario */
  getReviewsForUser(userId: string): ReviewInterface[] {
    return this.reviews.filter(r => r.userId === userId);
  }

  /** Obtener borradores de un usuario */
  getDrafts(userId: string, bookId?: string): ReviewInterface[] {
    return this.reviews.filter(
      r => r.draft && r.userId === userId && (!bookId || r.bookId === bookId)
    );
  }

  /** Verificar si un usuario ya publicó una reseña para un libro */
  hasUserReviewed(bookId: string, userId: string): boolean {
    return this.reviews.some(r => r.bookId === bookId && r.userId === userId && !r.draft);
  }

  /** Agregar comentario (solo si está publicada) */
  addComment(reviewId: string): void {
    const review = this.reviews.find(r => r.id === reviewId);
    if (review && !review.draft) {
      review.comments += 1;
    } else {
      console.warn('No se pueden comentar reseñas en borrador.');
    }
  }

  /** Actualizar reseña */
  updateReview(
    reviewId: string,
    updatedData: Partial<Omit<ReviewInterface, 'id' | 'userId' | 'bookId' | 'createdAt'>>
  ): void {
    const review = this.reviews.find(r => r.id === reviewId);
    if (!review) {
      console.warn('No se encontró la reseña a actualizar.');
      return;
    }

    Object.assign(review, updatedData);
    review.updatedAt = new Date();
  }

  /** Obtener reseña por ID */
  getReviewById(reviewId: string): ReviewInterface | undefined {
    return this.reviews.find(r => r.id === reviewId);
  }

  /** Like / Unlike */
  toggleLike(reviewId: string, hasLiked: boolean): void {
    const review = this.reviews.find(r => r.id === reviewId);
    if (!review || review.draft) return;

    review.likes += hasLiked ? -1 : 1;
    if (review.likes < 0) review.likes = 0;
  }
}
