import { inject, Injectable, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from './auth';
import { Post } from '../interfaces/post';
import { BookInterface } from '../interfaces/book-interface';
import { CollectionInterface } from '../interfaces/collection-interface';
import { ReviewInterface } from '../interfaces/review-interface';

@Injectable({
  providedIn: 'root'
})
export class SocialFeedService {
  private feed = signal<Post[]>([]);
  authService = inject(Auth);

  /** Devuelve el feed actual (reactivo con signals) */
  get feedItems(): Post[] {
    return this.feed();
  }

  /** Agrega un post al feed (si no existe ya) */
  addPost(post: Post) {
    const exists = this.feed().some(p => p.id === post.id);
    if (!exists) {
      this.feed.update(items => [post, ...items]);
    }
  }

  /** Elimina un post del feed */
  removePost(id: string) {
    this.feed.update(items => items.filter(p => p.id !== id));
  }

  /** Cargar solo las actividades de los últimos 30 días */
  loadRecentActivity(allPosts: Post[]) {
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - 30);
    this.feed.set(allPosts.filter(p => new Date(p.createdAt) >= limitDate));
  }

  /** Filtrar por los usuarios seguidos */
  loadFollowedUsersActivity(allPosts: Post[], followedUserIds: string[]) {
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - 30);

    this.feed.set(
      allPosts.filter(
        p =>
          followedUserIds.includes(p.userId) &&
          new Date(p.createdAt) >= limitDate
      )
    );
  }

  // --- 🔽 Métodos de integración automáticos --- //

  /** Se llama cuando un usuario crea una reseña */
  createReviewPost(review: ReviewInterface) {
    const user = this.authService.getUserLogged();
    if (!user || !user.email) return;

    const post: Post = {
      id: uuidv4(),
      userId: user.email,
      type: 'review',
      targetId: review.id,
      targetType: 'review',
      title: review.title,
      createdAt: new Date().toISOString()
    };

    this.addPost(post);
  }

  /** Se llama cuando un usuario completa un libro */
  createCompletedBookPost(book: BookInterface) {
    const user = this.authService.getUserLogged();
    if (!user || !user.email) return;

    const post: Post = {
      id: uuidv4(),
      userId: user.email,
      type: 'completed',
      targetId: String(book.id),
      targetType: 'book',
      title: book.title,
      createdAt: new Date().toISOString()
    };

    this.addPost(post);
  }

  /** Se llama cuando un usuario crea una colección */
  createCollectionPost(collection: CollectionInterface) {
    const user = this.authService.getUserLogged();
    if (!user || !user.email) return;

    const post: Post = {
      id: uuidv4(),
      userId: user.email,
      type: 'collection',
      targetId: collection.id,
      targetType: 'collection',
      title: collection.name,
      createdAt: new Date().toISOString()
    };

    this.addPost(post);
  }
}
