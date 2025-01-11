import { TwoFactors } from "./two-factors.model";

export interface SignInResponse {
  accessToken?: string;
  accessTokenExpires?: Date;
  refreshToken?: string;
  refreshTokenExpires?: Date;
  twoFactors?: TwoFactors[] | null;
}