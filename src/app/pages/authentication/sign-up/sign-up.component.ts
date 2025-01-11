import { Component } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../../core/services/loading.service';
import { IdentityService } from '../../../core/services/identity/services/identity.service';
import { ApiError } from '../../../core/services/api-response';
import { ErrorHandlerService } from '../../../core/services/http/error-handler.service';

@Component({
    selector: 'app-sign-up',
    standalone: true,
    imports: [RouterLink, 
        MatButton, 
        MatIconButton,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        FeathericonsModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        NgIf,
        TranslateModule],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
    hide: boolean = true;
    hideConfirmation: boolean = true;
    signUpForm: FormGroup;
    errorMessage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private translate: TranslateService,
        private loadingService: LoadingService,
        private identityService: IdentityService,
        private errorHandlerService: ErrorHandlerService
    ) {
        this.signUpForm = this.createAuthForm();
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

    private createAuthForm(): FormGroup {
        return this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
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

    onSubmit() {
            if (this.signUpForm.valid) {
                this.loadingService.show();
                const formData = this.signUpForm.value;
                this.errorMessage = "";
                this.identityService.signUp(formData).subscribe({
                    next: () => {
                        // REDIRECT TO SUCCESS PAGE & show Confirm Email text
                    },
                    error: (error: ApiError) => {
                        this.loadingService.hide();
                        this.signUpForm.reset();
                        this.handleError(error);
                    }
                });
            }
    }

    private handleError(error: ApiError) {
        this.errorHandlerService.handleError(error, this.signUpForm);
    }

}