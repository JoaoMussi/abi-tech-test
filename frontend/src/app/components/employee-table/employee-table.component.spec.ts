import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { EmployeeTableComponent } from './employee-table.component';
import { EmployeesService } from '../../services/employees.service';
import { of, throwError } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

describe('EmployeeTableComponent', () => {
  let component: EmployeeTableComponent;
  let fixture: ComponentFixture<EmployeeTableComponent>;
  let employeesService: EmployeesService;
  let confirmationService: ConfirmationService;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTableComponent],
      providers: [
        {
          provide: EmployeesService,
          useValue: {
            deleteEmployee: jest.fn(() => of(undefined)),
          },
        },
      ],
    })
      .overrideComponent(EmployeeTableComponent, {
        set: {
          providers: [MessageService, ConfirmationService],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EmployeeTableComponent);
    component = fixture.componentInstance;
    employeesService = TestBed.inject(EmployeesService);
    confirmationService =
      fixture.debugElement.injector.get(ConfirmationService);
    messageService = fixture.debugElement.injector.get(MessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call deleteConfirmed and emit employeeDeleted on successful delete', () => {
    jest.spyOn(component.employeeDeleted, 'emit');
    jest.spyOn(messageService, 'add');
    jest
      .spyOn(employeesService, 'deleteEmployee')
      .mockReturnValue(of(undefined));

    component['deleteConfirmed'](1);

    expect(employeesService.deleteEmployee).toHaveBeenCalledWith(1);
    expect(component.employeeDeleted.emit).toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Confirmed',
      detail: 'Employee deleted',
    });
  });

  it('should show error message when delete fails', fakeAsync(() => {
    jest.spyOn(messageService, 'add');
    jest
      .spyOn(employeesService, 'deleteEmployee')
      .mockReturnValue(throwError(() => new Error()));

    component['deleteConfirmed'](5);
    tick();

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Error occurred deleting employee',
    });
  }));
});
