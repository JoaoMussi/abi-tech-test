import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Employee } from '../interfaces/employee.interface';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${environment.API_URL}/employee`);
  }

  getEmployee(id: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${environment.API_URL}/employee/${id}`);
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(
      `${environment.API_URL}/employee`,
      employee
    );
  }

  updateEmployee(id: number, employee: Employee): Observable<void> {
    return this.http.put<void>(
      `${environment.API_URL}/employee/${id}`,
      employee
    );
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.API_URL}/employee/${id}`);
  }
}
