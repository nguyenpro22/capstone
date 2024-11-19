import { IResCommon } from "@/lib/api";

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
}

export interface ILoginRequest {
  emailOrUserName: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phonenumber: string;
  role: number;
}

export type AuthResponse = IResCommon<ILoginResponse>;
