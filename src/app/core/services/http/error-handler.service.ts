import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ApiError } from '../api-response';

@Injectable({
    providedIn: 'root',
})
export class ErrorHandlerService {
    constructor(private translate: TranslateService) {}

    handleError(error: ApiError, form: FormGroup): string {
        if (error.validation) {
            this.setFormValidationErrors(form, error.validation);
            return this.translate.instant('VALIDATION_FAILED');
        } else if (error.message) {
            return this.translate.instant('LOGIN_FAILED', { message: error.message });
        } else {
            return this.translate.instant('UNKNOWN_ERROR');
        }
    }

    private setFormValidationErrors(form: FormGroup, validationErrors: { [key: string]: string }) {
        Object.keys(validationErrors).forEach(key => {
            const control = form.get(key);
            if (control) {
                control.setErrors({ serverError: validationErrors[key] });
            }
        });
    }
}
