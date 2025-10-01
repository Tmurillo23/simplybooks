export interface LoginResponse {
  success:boolean;
  message?:string;
  redirectTo?:string;
}

export interface SignUpResponse extends LoginResponse{}
export interface ResetPasswordResponse extends LoginResponse{}