import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { EmployeeForm } from '../../interfaces/employee-form.interface';

@Component({
  selector: 'app-employee-form',
  imports: [
    CommonModule,
    InputTextModule,
    DatePickerModule,
    InputNumberModule,
    InputMaskModule,
    MessageModule,
    ReactiveFormsModule,
    PasswordModule,
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
})
export class EmployeeFormComponent {
  @Input() employeeForm!: FormGroup<EmployeeForm>;
  @Input() editMode: boolean = false;

  maxDate = new Date();
}
