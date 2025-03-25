import { Component } from '@angular/core';
import { EmployeesComponent } from './views/employees/employees.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [EmployeesComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';
}
