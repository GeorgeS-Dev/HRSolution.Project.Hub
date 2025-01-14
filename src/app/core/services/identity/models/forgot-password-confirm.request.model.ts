export interface forgotPasswordConfirmRequest {
    userId: string;
    code: string;
    password: string;
    confirmPassword: string;
}