import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { take } from 'rxjs';
import { EmployeeCreateModalComponent } from '../../components/employee-create-modal/employee-create-modal.component';
import { EmployeeTableComponent } from '../../components/employee-table/employee-table.component';
import { Employee } from '../../interfaces/employee.interface';
import { EmployeesService } from '../../services/employees.service';

@Component({
  selector: 'app-employees',
  imports: [
    CommonModule,
    ButtonModule,
    EmployeeTableComponent,
    EmployeeCreateModalComponent,
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  createVisible = false;

  constructor(private service: EmployeesService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.service
      .getEmployees()
      .pipe(take(1))
      .subscribe((response) => (this.employees = response));
  }
}
