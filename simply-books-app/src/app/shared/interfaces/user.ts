export interface User{
  username:string;
  password:string;
  email:string;
  rePassword?:string
  avatar_url?:string;
  created_at?:Date;
  followers_count?:number;
  following_count?:number;
}
