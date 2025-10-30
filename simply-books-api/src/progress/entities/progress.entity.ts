import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Book } from '../../book/entities/book.entity';

@Entity('progress')
export class Progress {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  state: string;

  @ManyToOne(() => User, user => user.progress)
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Book, book => book.progress)
  book: Book;

  @Column()
  bookId: string;
}
