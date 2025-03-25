import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { take } from 'rxjs';
import { EmployeeForm } from '../../interfaces/employee-form.interface';
import { Employee } from '../../interfaces/employee.interface';
import { EmployeesService } from '../../services/employees.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-employee-edit-modal',
  imports: [CommonModule, Dialog, EmployeeFormComponent, ButtonModule],
  templateUrl: './employee-edit-modal.component.html',
  styleUrl: './employee-edit-modal.component.scss',
})
export class EmployeeEditModalComponent implements OnInit {
  @Input() employeeId!: number;
  @Input() visible!: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() employeeUpdated: EventEmitter<void> = new EventEmitter<void>();

  employeeForm: FormGroup<EmployeeForm> | undefined;
  loading = signal(false);

  constructor(private employeeService: EmployeesService) {}

  ngOnInit(): void {
    this.employeeService
      .getEmployee(this.employeeId)
      .pipe(take(1))
      .subscribe((employee) => {
        this.setupForm(employee);
      });
  }

  saveEmployee(): void {
    if (!this.employeeForm!.valid) return;

    this.loading.set(true);
    this.employeeService
      .updateEmployee(
        this.employeeId,
        this.employeeForm!.getRawValue() as Employee
      )
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.employeeUpdated.emit();
          this.visible = false;
          this.visibleChange.emit(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  private setupForm(employee: Employee): void {
    this.employeeForm = new FormGroup<EmployeeForm>({
      id: new FormControl<number>(
        employee.id!,
        Validators.required
      ) as FormControl<number>,
      name: new FormControl<string>(employee.name, Validators.required),
      lastName: new FormControl<string>(employee.lastName, Validators.required),
      email: new FormControl<string>(employee.email, Validators.required),
      documentCode: new FormControl<string>(
        employee.documentCode,
        Validators.required
      ),
      role: new FormControl<string>(employee.role, Validators.required),
      managerName: new FormControl<string | null>(employee.managerName ?? null),
      birthDate: new FormControl<Date | null>(
        new Date(employee.birthDate),
        Validators.required
      ),
      phone: new FormControl<string | null>(
        employee.phone,
        Validators.required
      ),
    });
  }
}
