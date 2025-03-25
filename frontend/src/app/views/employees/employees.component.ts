import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EmployeeCreateModalComponent } from '../../components/employee-create-modal/employee-create-modal.component';
import { EmployeeEditModalComponent } from '../../components/employee-edit-modal/employee-edit-modal.component';
import { EmployeeTableComponent } from '../../components/employee-table/employee-table.component';
import { Employee } from '../../interfaces/employee.interface';
import { EmployeesService } from '../../services/employees.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-employees',
  imports: [
    CommonModule,
    ButtonModule,
    EmployeeTableComponent,
    EmployeeCreateModalComponent,
    EmployeeEditModalComponent,
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  createVisible = false;
  updateEmployeeId: number | undefined;

  constructor(private service: EmployeesService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  employeeCreated(): void {
    this.getEmployees();
  }

  updateEmployee(employeeId: number): void {
    this.updateEmployeeId = employeeId;
  }

  employeeUpdated(): void {
    this.updateEmployeeId = undefined;
    this.getEmployees();
  }

  private getEmployees(): void {
    this.service
      .getEmployees()
      .pipe(take(1))
      .subscribe((response) => (this.employees = response));
  }
}
