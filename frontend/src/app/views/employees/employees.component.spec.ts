import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeesService } from '../../services/employees.service';
import { EmployeesComponent } from './employees.component';
import { of } from 'rxjs';
import { EMPLOYEES_MOCK } from '../../__mocks__/employees.mock';

describe('EmployeesComponent', () => {
  let component: EmployeesComponent;
  let service: EmployeesService;
  let fixture: ComponentFixture<EmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: EmployeesService,
          useValue: {
            getEmployees: () => of(EMPLOYEES_MOCK),
            updateEmployee: () => of(undefined),
          },
        },
      ],
      imports: [EmployeesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeesComponent);
    service = TestBed.inject(EmployeesService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch employees on initialization', () => {
    fixture.detectChanges();
    expect(component.employees).toEqual(EMPLOYEES_MOCK);
  });

  it('should set updateEmployeeId when updateEmployee is called', () => {
    component.updateEmployee(5);
    expect(component.updateEmployeeId).toBe(5);
  });

  it('should clear updateEmployeeId and refresh employee list when employeeUpdated is called', () => {
    jest.spyOn(service, 'getEmployees').mockReturnValue(of(EMPLOYEES_MOCK));

    component.updateEmployee(3);
    component.employeeUpdated();

    expect(component.updateEmployeeId).toBeUndefined();
    expect(service.getEmployees).toHaveBeenCalled();
  });
});
