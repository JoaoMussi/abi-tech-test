import { TestBed } from '@angular/core/testing';

import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { EMPLOYEES_MOCK } from '../__mocks__/employees.mock';
import { EmployeesService } from './employees.service';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeesService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(EmployeesService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send expected GET request to get employees', (done) => {
    const expectedEmployees = EMPLOYEES_MOCK;
    jest.spyOn(http, 'get').mockReturnValue(of(expectedEmployees));

    service.getEmployees().subscribe((response) => {
      expect(response).toEqual(expectedEmployees);
      done();
    });
  });

  it('should send expected GET request to get employee', (done) => {
    const employeeId = 0;
    const expectedEmployee = EMPLOYEES_MOCK[employeeId];
    jest.spyOn(http, 'get').mockReturnValue(of(expectedEmployee));

    service.getEmployee(employeeId).subscribe((response) => {
      expect(response).toEqual(expectedEmployee);
      done();
    });
  });

  it('should send expected POST request to create employee', (done) => {
    const expectedEmployee = EMPLOYEES_MOCK[5];
    jest.spyOn(http, 'post').mockReturnValue(of(expectedEmployee));

    service.createEmployee(expectedEmployee).subscribe((response) => {
      expect(response).toEqual(expectedEmployee);
      done();
    });
  });

  it('should send expected PUT request to edit employee', (done) => {
    const employeeId = 3;
    const employee = EMPLOYEES_MOCK[employeeId];
    jest.spyOn(http, 'put').mockReturnValue(of(undefined));

    service.updateEmployee(employeeId, employee).subscribe((response) => {
      expect(response).toBeUndefined();
      done();
    });
  });

  it('should send expected DELETE request to delete employee', (done) => {
    const employeeId = 7;
    jest.spyOn(http, 'delete').mockReturnValue(of(undefined));

    service.deleteEmployee(employeeId).subscribe((response) => {
      expect(response).toBeUndefined();
      done();
    });
  });
});
