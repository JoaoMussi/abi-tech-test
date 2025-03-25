import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'employees',
        loadComponent: () =>
          import('./views/employees/employees.component').then(
            (c) => c.EmployeesComponent
          ),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./views/login/login.component').then((c) => c.LoginComponent),
  },
];
