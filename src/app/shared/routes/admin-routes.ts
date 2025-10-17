import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'currency',
    loadChildren: () => import('../../modules/currency/currency.routes'),
  },
  {
    path: 'brand',
    loadChildren: () => import('../../modules/brand/brand.routes'),
  },
  {
    path: 'product',
    loadChildren: () => import('../../modules/b2b-product/b2b-product.routes'),
  },
];
