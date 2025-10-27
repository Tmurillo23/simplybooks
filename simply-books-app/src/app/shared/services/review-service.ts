import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { ReviewInterface } from '../interfaces/review-interface';
import {User} from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviews: ReviewInterface[] = [];

  constructor() {}

  /**
   * Crear una nueva reseña.
   * Si no se especifica, se guarda como borrador por defecto.
   */
  addReview(
    reviewData: Omit<ReviewInterface, 'id' | 'likes' | 'comments' | 'createdAt' | 'updatedAt'>
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
    } else {
      console.warn('No se puede publicar: reseña no encontrada o ya publicada.');
    }
  }

  /**
   * Eliminar una reseña (borrador o publicada).
   */
  deleteReview(reviewId: string): void {
    this.reviews = this.reviews.filter(r => r.id !== reviewId);
  }

  /**
   * Obtener todas las reseñas asociadas a un libro.
   */
  getReviewsForBook(bookId: string): ReviewInterface[] {
    return this.reviews.filter(r => r.bookId === bookId);
  }

  /**
   * Obtener todas las reseñas escritas por un usuario.
   */
  getReviewsForUser(userId: string): ReviewInterface[] {
    return this.reviews.filter(r => r.userId === userId);
  }

  /**
   * Obtener los borradores de un usuario (opcionalmente filtrando por libro).
   */
  getDrafts(userId: string, bookId?: string): ReviewInterface[] {
    return this.reviews.filter(
      r => r.draft && r.userId === userId && (!bookId || r.bookId === bookId)
    );
  }

  /**
   * Verificar si un usuario ya publicó una reseña para un libro específico.
   */
  hasUserReviewed(bookId: string, userId: string): boolean {
    return this.reviews.some(r => r.bookId === bookId && r.userId === userId && !r.draft);
  }



  /**
   * Actualizar el contador de comentarios.
   * Solo reseñas publicadas pueden tener comentarios.
   */
  addComment(reviewId: string): void {
    const review = this.reviews.find(r => r.id === reviewId);
    if (review && !review.draft) {
      review.comments += 1;
    } else {
      console.warn('No se pueden comentar reseñas en borrador.');
    }
  }

  /**
   * Actualizar una reseña existente.
   * Se puede usar tanto para borradores como para publicadas.
   */
  updateReview(
    reviewId: string,
    updatedData: Partial<Omit<ReviewInterface, 'id' | 'userId' | 'bookId' | 'createdAt'>>
  ): void {
    const review = this.reviews.find(r => r.id === reviewId);
    if (!review) {
      console.warn('No se encontró la reseña a actualizar.');
      return;
    }

    // Actualizar solo los campos proporcionados
    Object.assign(review, updatedData);
    review.updatedAt = new Date();
  }


  /**
   * Obtener una reseña por ID.
   */
  getReviewById(reviewId: string): ReviewInterface | undefined {
    return this.reviews.find(r => r.id === reviewId);
  }


  /**
   * Dar o quitar like según si el usuario ya lo dio.
   */
  /**
   * Dar o quitar like según un marcador temporal.
   * No se guarda el usuario, solo se incrementa/decrementa el contador.
   */
  toggleLike(reviewId: string, hasLiked: boolean): void {
    const review = this.reviews.find(r => r.id === reviewId);
    if (!review || review.draft) return;

    if (hasLiked) {
      review.likes = Math.max(0, review.likes - 1);
    } else {
      review.likes += 1;
    }
  }


}
