import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Book } from '../../book/entities/book.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  beneficiary: string;

  @Column({ type: 'date' })
  loan_date: Date;

  @ManyToOne(() => User, user => user.loans)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Book, book => book.loans)
  book: Book;

  @Column()
  bookId: number;
}
