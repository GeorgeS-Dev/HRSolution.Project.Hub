export interface ConfirmEmailRequest {
  userId?: string;
  code?: string;
  isChangeEmail?: boolean;
}