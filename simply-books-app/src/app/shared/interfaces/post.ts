export type PostType = 'review' | 'completed' | 'collection';

export interface Post {
  id: string;
  userId: string; // quien generó la actividad
  type: PostType;
  targetId: string; // id del libro/colección/reseña
  targetType: 'book' | 'collection' | 'review';
  title?: string;
  createdAt: string;
}
