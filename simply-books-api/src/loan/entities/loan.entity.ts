import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Book } from '../../book/entities/book.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  beneficiary: string;

  @Column({ type: 'date' })
  loan_date: Date;

  @ManyToOne(() => User, user => user.loans)
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Book, book => book.loans)
  book: Book;

  @Column()
  bookId: string;
}
