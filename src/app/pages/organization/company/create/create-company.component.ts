import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { organizationService } from '../../../../core/services/organization/services/organization.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiError } from '../../../../core/services/api-response';
import { ErrorHandlerService } from '../../../../core/services/http/error-handler.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FeathericonsModule } from '../../../../icons/feathericons/feathericons.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-create-company',
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
      MatProgressSpinnerModule,
      RouterLink
  ],
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.scss']
})
export class CreateCompanyComponent {
  createCompanyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private organizationService: organizationService,
    private router: Router,
    private loadingService: LoadingService,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.createCompanyForm = this.loadCreateCompanyForm();
  }

  loadCreateCompanyForm() {
    return this.fb.group({
        industry: ['', Validators.required],
        name: ['', Validators.required],
        description: [''],
        country: [''],
        city: [''],
        address: [''],
        email: ['', [Validators.email]],
        phoneNumber: ['']
      });
  }

  onSubmit(): void {
    if (this.createCompanyForm.valid) {
      this.loadingService.show();
      const formData = this.createCompanyForm.value;
      this.organizationService.CreateCompany(formData).subscribe({
            next: () => {
                this.snackBar.open("Company Successfully Created", 'Close', {
                    duration: 5000,
                    panelClass: ['snackbar-success'],
                    horizontalPosition: 'left',
                    verticalPosition: 'top',
                });
                this.router.navigate(['/auth/sign-in']);
            },
            error: (error: ApiError) => {
                this.loadingService.hide();
                this.createCompanyForm.reset();
                this.handleError(error);
            }
      });
    }
  }

  private handleError(error: ApiError) {
      this.errorHandlerService.handleError(error, this.createCompanyForm);
  }
}