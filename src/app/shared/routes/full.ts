import { Routes } from '@angular/router';

export const full: Routes = [
  {
    path: 'error',
    loadChildren: () => import('../../errors/errors.routes'),
  },
  {
    path: 'auth',
    loadChildren: () => import('../../components/auth/auth.routes'),
  },
];
