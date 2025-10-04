import { Routes } from '@angular/router';

import { Berlin } from './berlin/berlin';
import { Denver } from './denver/denver';
import { Madrid } from './madrid/madrid';
import { Osaka } from './osaka/osaka';
import { Paris } from './paris/paris';
import { Rome } from './rome/rome';
import { Theme } from './theme';
import { Tokyo } from './tokyo/tokyo';

export default [
  {
    path: '',
    component: Theme,
  },
  {
    path: 'paris',
    component: Paris,
  },
  {
    path: 'tokyo',
    component: Tokyo,
  },
  {
    path: 'osaka',
    component: Osaka,
  },
  {
    path: 'rome',
    component: Rome,
  },
  {
    path: 'madrid',
    component: Madrid,
  },
  {
    path: 'berlin',
    component: Berlin,
  },
  {
    path: 'denver',
    component: Denver,
  },
] as Routes;
