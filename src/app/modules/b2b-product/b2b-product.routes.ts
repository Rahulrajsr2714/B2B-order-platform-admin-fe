import { Routes } from '@angular/router';

import { B2bProduct } from './b2b-product';
import { CreateProduct } from './components/create-product/create-product';
import { EditProduct } from './components/edit-product/edit-product';

export default [
  {
    path: '',
    component: B2bProduct,
  },
  {
    path: 'create',
    component: CreateProduct,
  },
  {
    path: 'edit/:id',
    component: EditProduct,
  },
] as Routes;
