import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'currency',
    loadChildren: () => import('../../modules/currency/currency.routes'),
  },
];
