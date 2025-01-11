import { TwoFactors } from "./two-factors.model";

export interface SignUpRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}