import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [authGuard],
    loadComponent: () =>
      import('./core/layout/layout.component').then((c) => c.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./views/home/home.component').then((c) => c.HomeComponent),
      },
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
  {
    path: 'register',
    loadComponent: () =>
      import('./views/register/register.component').then(
        (c) => c.RegisterComponent
      ),
  },
];
