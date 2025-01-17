import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { LoadingService } from '../../../core/services/loading.service';
import { IdentityService } from '../../../core/services/identity/services/identity.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApiError } from '../../../core/services/api-response';
import { ErrorHandlerService } from '../../../core/services/http/error-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forgotPasswordConfirmRequest } from '../../../core/services/identity/models/forgot-password-confirm.request.model';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, FeathericonsModule, TranslateModule],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
    resetPasswordForm: FormGroup;
    succeeded: boolean = false;
    userId: string = '';
    code: string = '';
    hide = true;
    hide2 = true;
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private loadingService: LoadingService,
        private identityService: IdentityService,
        private fb: FormBuilder,
        private errorHandlerService: ErrorHandlerService,
        private snackBar: MatSnackBar,
        private translate: TranslateService
    ) {
        this.resetPasswordForm = this.createResetPasswordForm();
    }

    private passwordMatchValidator(control: FormGroup) {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;

        if (password !== confirmPassword) {
            control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        return null;
    }
    
    private createResetPasswordForm(): FormGroup {
        return this.fb.group({
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).+$')
            ]],
            confirmPassword: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).+$'),
                this.passwordMatchValidator
            ]],
        });
    }    
      
    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.userId = params['userid'] || null;
            this.code = params['code'] || null;
        });
    }
    
    onSubmit() {
        if (this.resetPasswordForm.valid) {
            this.loadingService.show();
            const formData = this.resetPasswordForm.value;
            const request: forgotPasswordConfirmRequest = { userId: this.userId, code: this.code, password: formData.password, confirmPassword: formData.confirmPassword };
            this.identityService.forgotPasswordConfirm(request).subscribe({
                next: () => {
                    this.snackBar.open(this.translate.instant('RESET_PASSWORD_SUCCEEDED'), 'Close', {
                        duration: 5000,
                        panelClass: ['snackbar-success'],
                        horizontalPosition: 'left',
                        verticalPosition: 'top',
                    });
                    this.router.navigate(['/auth/sign-in']);
                },
                error: (error: ApiError) => {
                    this.loadingService.hide();
                    this.resetPasswordForm.reset();
                    this.handleError(error);
                }
            });
        }
    }

    private handleError(error: ApiError) {
        this.errorHandlerService.handleError(error, this.resetPasswordForm);
    }

}