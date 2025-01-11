import { ApiResponse, ApiError } from '../services/api-response.js';
import { IdentityExceptionMessages } from '../services/identity/enums/identityExceptionCodeTypes.js';
import { MatSnackBar } from '@angular/material/snack-bar';

export function parseAPIResponse<T>(response: ApiResponse<T>): T {
  if (response.succeeded) {
    if (response.data) {
      return response.data;
    }
    throw new Error('Response succeeded but no data was provided.');
  }

  throw new Error('An unknown error occurred.');
}

export function parseAPIResponseError(response: ApiResponse<null>, snackBar: MatSnackBar): ApiError {
  const apiError: ApiError = {
    message: null,
    validation: null,
  };

  if (response?.errorCode) {
    if (response.errorCode === 1800 && response.message) {
      try {
        const validationErrors = JSON.parse(response.message);
        if (Array.isArray(validationErrors)) {
          apiError.validation = validationErrors.reduce((acc: any, error: any) => {
            acc[error.PropertyName] = error.ErrorMessage;
            return acc;
          }, {});
          apiError.message = 'Validation error';
          return apiError;
        }
      } catch (e) {
        apiError.message = 'Invalid validation error format';
        snackBar.open(apiError.message, 'Close', {
          duration: 5000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'left',
          verticalPosition: 'top',
        });
        return apiError;
      }
    } else {
      apiError.message = IdentityExceptionMessages[response.errorCode] || 'Unknown error';
      snackBar.open(apiError.message, 'Close', {
        duration: 5000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'left',
        verticalPosition: 'top',
      });
      return apiError;
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
        return apiError;
      }
    } catch (e) {
      apiError.message = response.message;
      snackBar.open(apiError.message, 'Close', {
        duration: 5000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'left',
        verticalPosition: 'top',
      });
      return apiError;
    }
  }

  apiError.message = 'An unknown error occurred.';
  snackBar.open(apiError.message, 'Close', {
    duration: 5000,
    panelClass: ['snackbar-error'],
    horizontalPosition: 'left',
    verticalPosition: 'top',
  });
  return apiError;
}
