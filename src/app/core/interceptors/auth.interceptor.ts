import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngxs/store';
import { catchError, Observable, throwError } from 'rxjs';

import { AuthClearAction } from '../../shared/action/auth.action';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private store = inject(Store);
  private notificationService = inject(NotificationService);

  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    const token = this.store.selectSnapshot(state => state.auth.access_token);

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.notificationService.notification = false;
          this.store.dispatch(new AuthClearAction());
          void this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      }),
    );
  }
}
