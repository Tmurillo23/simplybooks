export class CreateCommentDto {
  text: string;
  date?: Date;
  userId: number;
  reviewId: number;
  parentId?: number;
}