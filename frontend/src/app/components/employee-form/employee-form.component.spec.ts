import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeFormComponent } from './employee-form.component';
import { Component, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmployeeForm } from '../../interfaces/employee-form.interface';
import { minAgeValidator } from '../../shared/validators/min-age.validator';

@Component({
  template: `<app-employee-form
    #employeeFormComponent
    [employeeForm]="employeeForm"
  ></app-employee-form>`,
  imports: [EmployeeFormComponent, ReactiveFormsModule],
})
class HostComponent {
  employeeForm: FormGroup<EmployeeForm>;

  constructor() {
    this.employeeForm = new FormGroup<EmployeeForm>({
      id: new FormControl<number>(
        1,
        Validators.required
      ) as FormControl<number>,
      name: new FormControl<string>('Jon', Validators.required),
      lastName: new FormControl<string>('Doe', Validators.required),
      email: new FormControl<string>('jon@doe.com', Validators.required),
      documentCode: new FormControl<string>('123456789', Validators.required),
      role: new FormControl<string>('Any Role', Validators.required),
      managerName: new FormControl<string | null>('Manager'),
      birthDate: new FormControl<Date | null>(new Date(2000, 1, 1), [
        Validators.required,
        minAgeValidator(),
      ]),
      hiringDate: new FormControl<Date | null>(new Date()),
      salary: new FormControl<number | null>(18000),
      phone: new FormControl<string | null>('999999999', Validators.required),
    });
  }

  @ViewChild('employeeFormComponent') employeeFormComponent:
    | EmployeeForm
    | undefined;
}
describe('EmployeeFormComponent', () => {
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, EmployeeFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
    expect(hostComponent.employeeFormComponent).toBeTruthy();
  });
});
