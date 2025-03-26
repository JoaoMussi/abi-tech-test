import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { EmployeeCreateModalComponent } from './employee-create-modal.component';
import { EmployeesService } from '../../services/employees.service';
import { of, throwError } from 'rxjs';
import { EMPLOYEES_MOCK } from '../../__mocks__/employees.mock';

describe('EmployeeCreateModalComponent', () => {
  let component: EmployeeCreateModalComponent;
  let fixture: ComponentFixture<EmployeeCreateModalComponent>;
  let service: EmployeesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: EmployeesService,
          useValue: { createEmployee: () => of(EMPLOYEES_MOCK[0]) },
        },
      ],
      imports: [EmployeeCreateModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeCreateModalComponent);
    service = TestBed.inject(EmployeesService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create employee', fakeAsync(() => {
    jest.spyOn(component.loading, 'set');
    jest.spyOn(component.employeeCreated, 'emit');
    jest.spyOn(component.visibleChange, 'emit');
    component.employeeForm.setValue({
      name: 'Jon',
      lastName: 'Doe',
      email: 'jon@doe.com',
      documentCode: '123456789',
      role: 'Any Role',
      managerName: '',
      birthDate: new Date(2000, 1, 1),
      hiringDate: new Date(),
      salary: null,
      password: '123',
      phone: '999999999',
    });

    component.saveEmployee();
    tick();

    expect(component.loading.set).toHaveBeenCalledTimes(2);
    expect(component.loading.set).toHaveBeenCalledWith(false);
    expect(component.employeeCreated.emit).toHaveBeenCalled();
    expect(component.visibleChange.emit).toHaveBeenCalledWith(false);
  }));

  it('should prevent employee creation', () => {
    jest.spyOn(component.loading, 'set');
    jest.spyOn(service, 'createEmployee');

    component.saveEmployee();

    expect(component.loading.set).not.toHaveBeenCalled();
    expect(service.createEmployee).not.toHaveBeenCalled();
  });

  it('should enable button on error', fakeAsync(() => {
    jest.spyOn(component.loading, 'set');
    jest
      .spyOn(service, 'createEmployee')
      .mockImplementation(() => throwError(() => new Error()));
    component.employeeForm.setValue({
      name: 'Jon',
      lastName: 'Doe',
      email: 'jon@doe.com',
      documentCode: '123456789',
      role: 'Any Role',
      managerName: '',
      birthDate: new Date(2000, 1, 1),
      hiringDate: new Date(),
      salary: null,
      password: '123',
      phone: '999999999',
    });

    component.saveEmployee();
    tick();

    expect(component.loading.set).toHaveBeenCalledTimes(2);
    expect(component.loading.set).toHaveBeenCalledWith(false);
  }));
});
