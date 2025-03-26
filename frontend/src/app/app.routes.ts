import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './core/layout/layout.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [authGuard],
    component: LayoutComponent,
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
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];
