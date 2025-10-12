export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  biography?: string;
  books_read?: number;
  reviews_written?: number;
  followers_count?: number;
  following_count?: number;
}