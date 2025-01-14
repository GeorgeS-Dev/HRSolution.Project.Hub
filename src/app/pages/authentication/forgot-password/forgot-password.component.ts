import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { LoadingService } from '../../../core/services/loading.service';
import { IdentityService } from '../../../core/services/identity/services/identity.service';
import { ApiError } from '../../../core/services/api-response';
import { ErrorHandlerService } from '../../../core/services/http/error-handler.service';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, FeathericonsModule, NgIf, TranslateModule, MatSnackBarModule],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
    forgotPasswordForm: FormGroup;
    formConfirmed: boolean = false;

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private identityService: IdentityService,
        private errorHandlerService: ErrorHandlerService,
        private snackBar: MatSnackBar,
    ) {
        this.forgotPasswordForm = this.createForgotPasswordForm();
    }

    private createForgotPasswordForm(): FormGroup {
        return this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }
    
        onSubmit() {
                if (this.forgotPasswordForm.valid) {
                    this.loadingService.show();
                    const formData = this.forgotPasswordForm.value;
                    this.identityService.forgotPasswordSend(formData).subscribe({
                        next: () => {
                            this.loadingService.hide();
                            this.formConfirmed = true;
                        },
                        error: (error: ApiError) => {
                            this.loadingService.hide();
                            this.forgotPasswordForm.reset();
                            this.handleError(error);
                        }
                    });
                }
        }

        private handleError(error: ApiError) {
            this.errorHandlerService.handleError(error, this.forgotPasswordForm);
        }
}