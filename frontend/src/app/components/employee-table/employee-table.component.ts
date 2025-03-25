import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Employee } from '../../interfaces/employee.interface';

@Component({
  selector: 'app-employee-table',
  imports: [TableModule, ButtonModule],
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.scss',
})
export class EmployeeTableComponent {
  @Input() employees!: Employee[];
  @Output() updateEmployee: EventEmitter<number> = new EventEmitter<number>();
}
