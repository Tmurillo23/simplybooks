export class CreateReviewDto {
  text: string;
  rating: number;
  date?: Date;
  draft?: boolean;
  userId: string;
  bookId: string;
}