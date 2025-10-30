export interface UserStats {
  booksRead:number;
  reviewsCount:number;
  followersCount:number;
  followingCount:number;
}
export interface User{
  id?:string;
  username:string;
  password:string;
  email:string;
  rePassword?:string
  avatar?:string;
  created_at?:Date;
  biography?:string;
  following?: boolean;
  stats?:UserStats;
}
