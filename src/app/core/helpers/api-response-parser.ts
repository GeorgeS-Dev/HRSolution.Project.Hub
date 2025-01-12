import { TranslateService } from '@ngx-translate/core';
import { ApiResponse, ApiError } from '../services/api-response.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';

export function parseAPIResponse<T>(response: ApiResponse<T>): T {
  if (response.succeeded) {
    if (response.data) {
      return response.data;
    }
    throw new Error('Response succeeded but no data was provided.');
  }

  throw new Error('An unknown error occurred.');
}

export function parseAPIResponseError(response: ApiResponse<null>, snackBar: MatSnackBar, translate: TranslateService): Observable<ApiError> {
  const apiError: ApiError = {
    message: null,
    validation: null,
  };

  return new Observable<ApiError>((observer) => {
    if (response?.errorCode) {
      if (response.errorCode === 1800 && response.message) {
        try {
          const validationErrors = JSON.parse(response.message);
          if (Array.isArray(validationErrors)) {
            apiError.validation = validationErrors.reduce((acc: any, error: any) => {
              acc[error.PropertyName] = error.ErrorMessage;
              return acc;
            }, {});
            translate.get('ERRORS.VALIDATION').subscribe((translation) => {
              apiError.message = translation;
              observer.next(apiError);
              observer.complete();
            });
            return;
          }
        } catch (e) {
          translate.get('ERRORS.INVALID').subscribe((translation) => {
            apiError.message = translation;
            snackBar.open(apiError.message || '', 'Close', {
              duration: 5000,
              panelClass: ['snackbar-error'],
              horizontalPosition: 'left',
              verticalPosition: 'top',
            });
            observer.next(apiError);
            observer.complete();
          });
          return;
        }
      } else {
        const fallbackMessage = 'Unknown error';
        translate.get("ERRORS." + response.errorCode.toString()).subscribe({
          next: (translation) => {
            apiError.message = translation || fallbackMessage;
            snackBar.open(apiError.message || '', 'Close', {
              duration: 5000,
              panelClass: ['snackbar-error'],
              horizontalPosition: 'left',
              verticalPosition: 'top',
            });
            observer.next(apiError);
            observer.complete();
          },
          error: () => {
            translate.get('ERRORS.UNKNOWN').subscribe((translation) => {
              apiError.message = translation;
              snackBar.open(apiError.message || '', 'Close', {
                duration: 5000,
                panelClass: ['snackbar-error'],
                horizontalPosition: 'left',
                verticalPosition: 'top',
              });
              observer.next(apiError);
              observer.complete();
            });
          }
        });
        return;
      }
    }

    if (response?.message) {
      try {
        const validationErrors = JSON.parse(response.message);
        if (Array.isArray(validationErrors)) {
          apiError.validation = validationErrors.reduce((acc: any, error: any) => {
            acc[error.PropertyName] = error.ErrorMessage;
            return acc;
          }, {});
          observer.next(apiError);
          observer.complete();
          return;
        }
      } catch (e) {
        apiError.message = response.message;
        snackBar.open(apiError.message, 'Close', {
          duration: 5000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'left',
          verticalPosition: 'top',
        });
        observer.next(apiError);
        observer.complete();
        return;
      }
    }

    observer.next(apiError);
    observer.complete();
  });
}