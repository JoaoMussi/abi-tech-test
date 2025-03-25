import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { EmployeeEditModalComponent } from './employee-edit-modal.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeForm } from '../../interfaces/employee-form.interface';
import { EmployeesService } from '../../services/employees.service';
import { of, throwError } from 'rxjs';
import { EMPLOYEES_MOCK } from '../../__mocks__/employees.mock';

describe('EmployeeEditModalComponent', () => {
  let component: EmployeeEditModalComponent;
  let service: EmployeesService;
  let fixture: ComponentFixture<EmployeeEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: EmployeesService,
          useValue: {
            getEmployee: () => of(EMPLOYEES_MOCK[0]),
            updateEmployee: () => of(undefined),
          },
        },
      ],
      imports: [EmployeeEditModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeEditModalComponent);
    service = TestBed.inject(EmployeesService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should edit employee', fakeAsync(() => {
    jest.spyOn(component.loading, 'set');
    jest.spyOn(component.employeeUpdated, 'emit');
    jest.spyOn(component.visibleChange, 'emit');
    component.employeeForm = new FormGroup<EmployeeForm>({
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
      birthDate: new FormControl<Date | null>(new Date(), Validators.required),
      phone: new FormControl<string | null>('999999999', Validators.required),
    });

    component.saveEmployee();
    tick();

    expect(component.loading.set).toHaveBeenCalledTimes(2);
    expect(component.loading.set).toHaveBeenCalledWith(false);
    expect(component.employeeUpdated.emit).toHaveBeenCalled();
    expect(component.visibleChange.emit).toHaveBeenCalledWith(false);
  }));

  it('should prevent employee update', () => {
    jest.spyOn(component.loading, 'set');
    jest.spyOn(service, 'updateEmployee');

    component.saveEmployee();

    expect(component.loading.set).not.toHaveBeenCalled();
    expect(service.updateEmployee).not.toHaveBeenCalled();
  });

  it('should enable button on error', fakeAsync(() => {
    jest.spyOn(component.loading, 'set');
    jest
      .spyOn(service, 'updateEmployee')
      .mockImplementation(() => throwError(() => new Error()));
    component.employeeForm = new FormGroup<EmployeeForm>({
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
      birthDate: new FormControl<Date | null>(new Date(), Validators.required),
      phone: new FormControl<string | null>('999999999', Validators.required),
    });

    component.saveEmployee();
    tick();

    expect(component.loading.set).toHaveBeenCalledTimes(2);
    expect(component.loading.set).toHaveBeenCalledWith(false);
  }));
});
