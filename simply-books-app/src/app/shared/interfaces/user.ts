export interface UserStats {
  booksRead: number;
  reviewsCount: number;
  followersCount: number;
  followingCount: number;
}
export interface User{
  username:string;
  password:string;
  email:string;
  rePassword?:string
  avatar_url?:string;
  created_at?:Date;
  bio?:string;
  following?: boolean;
  stats?:UserStats;
}
