import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'management-tool',
    pathMatch: 'full',
  },
  {
    path: 'management-tool',
    loadComponent: () => import('./management-tool/management-tool.component'),
  },
];
