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
});
