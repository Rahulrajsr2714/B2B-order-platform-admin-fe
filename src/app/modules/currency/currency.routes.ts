import { Routes } from '@angular/router';

import { CreateCurrency } from './components/create-currency/create-currency';
import { Currency } from './currency';
import { EditCurrency } from './components/edit-currency/edit-currency';

export default [
  {
    path: '',
    component: Currency,
  },
  {
    path: 'create',
    component: CreateCurrency,
  },
  {
    path: 'edit/:id',
    component: EditCurrency,
  },
] as Routes;
