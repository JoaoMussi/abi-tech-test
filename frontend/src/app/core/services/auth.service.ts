import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<void> {
    return this.http
      .post<{ token: string }>(`${environment.API_URL}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap(({ token }) => localStorage.setItem('token', token)),
        map(() => undefined)
      );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
