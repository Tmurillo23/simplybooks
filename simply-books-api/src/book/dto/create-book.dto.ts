export class CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  cover?: string;
  userId: number;
}