export type CustomError = {
    status: number;
    message: string;
    code: CustomErrorCode;
  };
  
  export enum CustomErrorCode {
    USER_NOT_EXISTS = "USER_NOT_EXISTS",
  }