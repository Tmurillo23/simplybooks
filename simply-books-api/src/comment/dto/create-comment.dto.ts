export class CreateCommentDto {
  text: string;
  date?: Date;
  userId: string;
  reviewId: string;
  parentId?: string;
}