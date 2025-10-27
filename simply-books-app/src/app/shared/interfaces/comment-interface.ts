import {User} from './user';

export interface CommentInterface {
  id: string;
  reviewId: string;
  userId: string;
  content: string;
  parentId?: string;
  createdAt: Date;
  likes: number;
}
