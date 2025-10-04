import { Routes } from '@angular/router';

import { Brand } from './brand';
import { CreateBrand } from './components/create-brand/create-brand';
import { EditBrand } from './components/edit-brand/edit-brand';

export default [
  {
    path: '',
    component: Brand,
  },
  {
    path: 'create',
    component: CreateBrand,
  },
  {
    path: 'edit/:id',
    component: EditBrand,
  },
] as Routes;
