import { Component } from '@angular/core';
import {
    FormsModule,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';
import { ApiError } from '../../../core/services/api-response';
import { TwoFactors } from '../../../core/services/identity/models/two-factors.model';
import { IdentityService } from '../../../core/services/identity/services/identity.service';
import { AuthService } from '../../../core/services/identity/services/auth.service';
import { TokenService } from '../../../core/services/identity/services/token.service';
import { SignInResponse } from '../../../core/services/identity/models/sign-in-response.model';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandlerService } from '../../../core/services/http/error-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [
        MatButton,
        MatIconButton,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        FeathericonsModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        NgIf,
        TranslateModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
    hide: boolean = true;
    showTwoFactor: boolean = false;
    errorMessage: string | null = null;
    twoFactorTypes: TwoFactors[] | null = null;
    authForm: FormGroup;
    twoFactorForm: FormGroup;
    email: string = '';
    password: string = '';
    loading: boolean = false;

    constructor(
        public authService: AuthService,
        private fb: FormBuilder,
        private identityService: IdentityService,
        private tokenService: TokenService,
        private router: Router,
        private translate: TranslateService,
        private errorHandlerService: ErrorHandlerService,
        private snackBar: MatSnackBar,
        private loadingService: LoadingService
    ) {
        this.authForm = this.createAuthForm();
        this.twoFactorForm = this.createTwoFactorForm();
    }

    private createAuthForm(): FormGroup {
        return this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).+$')
            ]],
        });
    }

    private createTwoFactorForm(): FormGroup {
        return this.fb.group({
            twoFactorCode: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(6),
                    Validators.pattern('^[0-9]{6}$'),
                ],
            ],
        });
    }

    onSubmit() {
        if (this.authForm.valid) {
            this.loadingService.show();
            const formData = this.authForm.value;
            this.errorMessage = "";
            this.identityService.signIn(formData).subscribe({
                next: (data: SignInResponse) => {
                    this.loadingService.hide();
                    this.handleSignInResponse(data);
                },
                error: (error: ApiError) => {
                    this.loadingService.hide();
                    this.authForm.reset();
                    this.handleError(error);
                }
            });
        }
    }

    private handleSignInResponse(data: SignInResponse) {

        if (data.twoFactors) {
            this.email = this.authForm.value.email;
            this.password = this.authForm.value.password;
            this.showTwoFactor = true;
        }

        if (data.accessToken) {
            this.tokenService.setToken(data.accessToken, data.accessTokenExpires, data.refreshToken, data.refreshTokenExpires);
            this.authService.onLogin.emit(); 
            this.snackBar.open(this.translate.instant('LOGIN_SUCCEEDED'), 'Close', {
                duration: 5000,
                panelClass: ['snackbar-success'],
                horizontalPosition: 'left',
                verticalPosition: 'top',
            });
            this.router.navigate(['/']);
        }
    }

    onSubmitTwoFactor() {
        if (this.twoFactorForm.valid) {
            this.loadingService.show();
            const code = this.twoFactorForm.value.twoFactorCode;
            this.identityService.confirmTwoFactorSignIn(this.email, this.password, code).subscribe({
                next: (data: SignInResponse) => {
                    this.loadingService.hide();
                    this.handleTwoFactorResponse(data);
                },
                error: (error: ApiError) => {
                    this.loadingService.hide();
                    this.handleTwoFactorError(error);
                }
            });
        }
    }

    private handleTwoFactorResponse(data: SignInResponse) {
        if (data.accessToken) {
            this.authService.setAccessToken(data.accessToken);
            this.tokenService.setToken(data.accessToken, data.accessTokenExpires, data.refreshToken, data.refreshTokenExpires);
            this.authService.onLogin.emit(); 
            this.snackBar.open(this.translate.instant('LOGIN_SUCCEEDED'), 'Close', {
                duration: 5000,
                panelClass: ['snackbar-success'],
                horizontalPosition: 'left',
                verticalPosition: 'top',
            });
            this.router.navigate(['/']);
        }
    }

    private handleTwoFactorError(error: ApiError) {
        this.showTwoFactor = false;
        this.twoFactorForm.reset();
        this.handleError(error);
    }

    private handleError(error: ApiError) {
        this.errorHandlerService.handleError(error, this.authForm);
    }
}
