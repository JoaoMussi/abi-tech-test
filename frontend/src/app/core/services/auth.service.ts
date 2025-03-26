import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, take, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Employee } from '../../interfaces/employee.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<void> {
    return this.http
      .post<{ authToken: string }>(`${environment.API_URL}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap(({ authToken }) => localStorage.setItem('authToken', authToken)),
        map(() => undefined)
      );
  }

  register(employee: Employee): Observable<void> {
    return this.http.post<void>(
      `${environment.API_URL}/auth/register`,
      employee
    );
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
