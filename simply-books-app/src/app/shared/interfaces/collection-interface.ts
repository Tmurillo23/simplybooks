import { BookInterface } from './book-interface';
import { User } from './user';

export interface CollectionInterface {
  id: string;
  user: User;
  name: string;
  description?: string;
  books: BookInterface[];
  created_at?: Date;
  updated_at?: Date;
}
