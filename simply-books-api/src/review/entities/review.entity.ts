import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Book } from '../../book/entities/book.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Like } from '../../like/entities/like.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  text: string;

  @Column()
  rating: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ default: false })
  draft: boolean;

  @ManyToOne(() => User, user => user.reviews)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Book, book => book.reviews)
  book: Book;

  @Column()
  bookId: number;

  @OneToMany(() => Comment, comment => comment.review)
  comments: Comment[];

  @OneToMany(() => Like, like => like.review)
  likes: Like[];
}
