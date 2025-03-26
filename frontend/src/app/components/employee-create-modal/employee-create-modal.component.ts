import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { EmployeeForm } from '../../interfaces/employee-form.interface';
import { Employee } from '../../interfaces/employee.interface';
import { EmployeesService } from '../../services/employees.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { minAgeValidator } from '../../shared/validators/min-age.validator';

@Component({
  selector: 'app-employee-create-modal',
  imports: [CommonModule, ButtonModule, Dialog, EmployeeFormComponent],
  templateUrl: './employee-create-modal.component.html',
  styleUrl: './employee-create-modal.component.scss',
})
export class EmployeeCreateModalComponent {
  @Input() visible!: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() employeeCreated: EventEmitter<void> = new EventEmitter<void>();

  employeeForm: FormGroup<EmployeeForm>;
  loading = signal(false);

  constructor(private employeeService: EmployeesService) {
    this.employeeForm = new FormGroup<EmployeeForm>({
      name: new FormControl<string>('', Validators.required),
      lastName: new FormControl<string>('', Validators.required),
      email: new FormControl<string>('', Validators.required),
      documentCode: new FormControl<string>('', Validators.required),
      role: new FormControl<string>('', Validators.required),
      managerName: new FormControl<string>(''),
      birthDate: new FormControl<Date | null>(null, [
        Validators.required,
        minAgeValidator(),
      ]),
      hiringDate: new FormControl<Date | null>(new Date()),
      salary: new FormControl<number | null>(null),
      phone: new FormControl<string | null>(null, Validators.required),
      password: new FormControl<string | null>(null, Validators.required),
    });
  }

  saveEmployee(): void {
    if (!this.employeeForm.valid) return;

    this.loading.set(true);
    this.employeeService
      .createEmployee(this.employeeForm.getRawValue() as Employee)
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.employeeCreated.emit();
          this.visibleChange.emit(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
}
