export interface LoginResponse{
  success:boolean;
  redirectTo?:string;
}

export interface SignUpResponse extends LoginResponse{
  message?:string;
};
