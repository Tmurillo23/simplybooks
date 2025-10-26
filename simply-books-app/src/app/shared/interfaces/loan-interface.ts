import { BookInterface } from './book-interface';

export interface Loan {
  id: string;
  beneficiary: string;
  book: BookInterface;
  loanDate: Date;
  returned: boolean;
  returnDate?: Date;
}
