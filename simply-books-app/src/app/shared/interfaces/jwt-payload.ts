import { UserStats } from "./user";

export interface JwtPayload{
  id:string;
  username:string;
  password:string;
  email:string;
  rePassword?:string
  avatar_url?:string;
  created_at?:Date;
  bio?:string;
  following?: boolean;
  stats?:UserStats;
  iat: number;
  exp?:number;
}