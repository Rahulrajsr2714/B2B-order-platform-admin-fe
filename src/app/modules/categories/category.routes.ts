import { Routes } from '@angular/router';

import { Category } from './category';
import { EditCategory } from './components/edit-category/edit-category';

export default [
  {
    path: '',
    component: Category,
  },
  {
    path: 'edit/:id',
    component: EditCategory,
  },
] as Routes;
