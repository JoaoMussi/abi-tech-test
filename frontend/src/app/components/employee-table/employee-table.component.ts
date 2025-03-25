import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { take } from 'rxjs';
import { Employee } from '../../interfaces/employee.interface';
import { EmployeesService } from '../../services/employees.service';
import { ToastModule } from 'primeng/toast';
import { EmployeeEditModalComponent } from '../employee-edit-modal/employee-edit-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-table',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ConfirmDialog,
    ToastModule,
    EmployeeEditModalComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.scss',
})
export class EmployeeTableComponent {
  @Input() employees!: Employee[];
  @Output() employeeDeleted: EventEmitter<void> = new EventEmitter<void>();
  @Output() employeeUpdated: EventEmitter<void> = new EventEmitter<void>();

  loadingDelete = signal(false);
  showEditModal = signal(false);
  updateEmployeeId: number | undefined;

  constructor(
    private confirmationService: ConfirmationService,
    private employeesService: EmployeesService,
    private messageService: MessageService
  ) {}

  confirmDelete(event: Event, employeeId: number): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete this employee?',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
      },
      accept: () => {
        this.deleteConfirmed(employeeId);
      },
    });
  }

  updateEmployee(employeeId: number): void {
    this.updateEmployeeId = employeeId;
    this.showEditModal.set(true);
  }

  private deleteConfirmed(employeeId: number): void {
    this.employeesService
      .deleteEmployee(employeeId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.employeeDeleted.emit();
          this.messageService.add({
            severity: 'success',
            summary: 'Confirmed',
            detail: 'Employee deleted',
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error occurred deleting employee',
          });
        },
      });
  }
}
