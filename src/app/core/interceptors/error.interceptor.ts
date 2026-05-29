import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 400) {
        let msg = 'Validation error';
        if (error.error && error.error.detail) {
          if (Array.isArray(error.error.detail)) {
            msg = error.error.detail.map((e: any) => e.Message || e.message).join(', ');
          } else if (typeof error.error.detail === 'string') {
            msg = error.error.detail;
          }
        } else if (error.error && error.error.message) {
          msg = error.error.message;
        }
        toastService.showError(msg);
      } else if (error.status === 401) {
        toastService.showWarning("Session expired. Please login again.");
        authService.logout();
        router.navigate(['/login']);
      } else if (error.status === 403) {
        toastService.showError("You don't have permission for this action.");
        router.navigate(['/unauthorized']);
      } else if (error.status === 500) {
        toastService.showError("Something went wrong. Please try again.");
      } else if (error.status === 0) {
        toastService.showError("Cannot connect to server.");
      }
      return throwError(() => error);
    })
  );
};
