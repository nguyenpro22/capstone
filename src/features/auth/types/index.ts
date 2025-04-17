import { IResCommon } from "@/lib/api";

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
}
export interface IRefreshToken {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
}

export interface IRefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  Email: string;
  Password: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  DateOfBirth: string;
  Address: string;
}

export interface IVerifyRequest {
  email: string;
  code: string;
  type: number;
}
export interface IChangePasswordStaffRequest {
  newPassword: string;
  oldPassword: string;
  workingTimeStart?: string;
  workingTimeEnd?: string;
}