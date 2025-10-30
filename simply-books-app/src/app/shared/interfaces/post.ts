export type PostType = 'review' | 'completed' | 'collection';

export interface Post {
  id: string;
  userId: string;
  type: PostType;
  targetId: string;
  targetType: 'book' | 'collection' | 'review';
  title?: string;
  createdAt: string;
}
