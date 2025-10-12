import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Review } from '../../review/entities/review.entity';
import { Loan } from '../../loan/entities/loan.entity';
import { Progress } from '../../progress/entities/progress.entity';
import { CollectionBook } from '../../collection-book/entities/collection-book.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ unique: true })
  isbn: string;

  @Column({ nullable: true })
  cover: string;

  @ManyToOne(() => User, user => user.books)
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => Review, review => review.book)
  reviews: Review[];

  @OneToMany(() => Loan, loan => loan.book)
  loans: Loan[];

  @OneToMany(() => Progress, progress => progress.book)
  progress: Progress[];

  @OneToMany(() => CollectionBook, collectionBook => collectionBook.book)
  collectionBooks: CollectionBook[];
}
