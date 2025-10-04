import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';

import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { GetUserDetailsAction } from '../../shared/action/account.action';
import { GetBadgesAction } from '../../shared/action/menu.action';
import { GetNotificationAction } from '../../shared/action/notification.action';
import { NavService } from '../../shared/services/nav.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private store = inject(Store);
  private router = inject(Router);
  private navService = inject(NavService);
  private platformId = inject<Object>(PLATFORM_ID);

  canActivate(): Observable<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuthStatus().pipe(
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          this.initializeData();
          return of(true);
        } else {
          return of(this.router.createUrlTree(['/auth/login']));
        }
      }),
    );
    if (isPlatformBrowser(this.platformId)) {
      // Running in the browser, perform auth check
    } else {
      // Running on the server, allow SSR to proceed
      return true;
    }
  }

  canActivateChild(): Observable<boolean> | boolean {
    return this.checkAuthStatus().pipe(
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          // Optionally delay navigation or perform additional checks here
          return of(true);
        }
        // User is not authenticated, proceed to the child route without redirect
        return of(true);
      }),
    );
    if (isPlatformBrowser(this.platformId)) {
    } else {
      // Allow SSR to proceed without child route restrictions
      return true;
    }
  }

  private checkAuthStatus(): Observable<boolean> {
    return this.store
      .select(state => !!state.auth?.access_token)
      .pipe(
        map(access_token => !!access_token), // Convert to boolean
        catchError(() => of(false)), // Handle errors, e.g., when access_token is not available
      );
  }

  private initializeData(): void {
    this.navService.sidebarLoading = true;
    this.store.dispatch(new GetBadgesAction());
    this.store.dispatch(new GetNotificationAction());
    this.store.dispatch(new GetUserDetailsAction()).subscribe({
      complete: () => {
        this.navService.sidebarLoading = false;
      },
    });
  }
}
