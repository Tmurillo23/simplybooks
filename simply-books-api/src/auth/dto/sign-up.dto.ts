interface UserStats {
  booksRead:number;
  reviewsCount:number;
  followersCount:number;
  followingCount:number;
}

export class SignUpDto {
  username:string;
  password:string;
  email:string;
  avatar_url?:string;
  created_at?:Date;
  bio?:string;
  following?: boolean;
  stats?:UserStats;
}