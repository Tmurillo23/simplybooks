export class CreateReviewDto {
  text: string;
  rating: number;
  date?: Date;
  draft?: boolean;
  userId: number;
  bookId: number;
}