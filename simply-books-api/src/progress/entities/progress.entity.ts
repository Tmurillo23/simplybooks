import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Book } from '../../book/entities/book.entity';

@Entity('progress')
export class Progress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state: string;

  @ManyToOne(() => User, user => user.progress)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Book, book => book.progress)
  book: Book;

  @Column()
  bookId: number;
}
