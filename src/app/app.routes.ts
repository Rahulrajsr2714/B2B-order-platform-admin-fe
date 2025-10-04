import { Routes } from '@angular/router';

import { AuthGuard } from './core/guard/auth.guard';
import { full } from './shared/routes/full';
import { content } from './shared/routes/routes';
import { adminRoutes } from './shared/routes/admin-routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.routes'),
    canActivateChild: [AuthGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./shared/components/layout/content/content').then(
        (m) => m.Content,
      ),
    children: adminRoutes,
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/layout/content/content').then(
        (m) => m.Content,
      ),
    children: content,
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/layout/full/full').then((m) => m.Full),
    children: full,
  },
  {
    path: '**',
    pathMatch: 'full',
    loadComponent: () =>
      import('./errors/error404/error404').then((m) => m.Error404),
  },
];
