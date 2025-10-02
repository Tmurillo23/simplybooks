export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  password?: string;
  avatarUrl?: string;
  bio?: string;
}
