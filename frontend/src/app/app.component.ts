import { Component } from '@angular/core';
import { EmployeesComponent } from './views/employees/employees.component';

@Component({
  selector: 'app-root',
  imports: [EmployeesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';
}
