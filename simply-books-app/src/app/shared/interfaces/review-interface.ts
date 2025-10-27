export interface ReviewInterface {
  id: string;
  userId: string;
  bookId: string;
  title: string;
  content: string;
  rating: number;
  draft?: boolean;
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt?: Date;
}
