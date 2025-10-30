export interface SignUpResponse{
    success:boolean;
    message?:string;
    redirectTo?:string;
}

export interface SignUpServiceResponse{
    success:boolean;
    token:string;
}