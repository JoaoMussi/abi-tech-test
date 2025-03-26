import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { EMPLOYEES_MOCK } from '../../__mocks__/employees.mock';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login', fakeAsync(() => {
    jest.spyOn(http, 'post').mockReturnValue(of({ token: 123 }));
    const spy = jest.spyOn(global.Storage.prototype, 'setItem');

    service.login('jon@example.com', 'password').subscribe();
    tick();

    expect(http.post).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('token', 123);
  }));

  it('should register', fakeAsync(() => {
    jest.spyOn(http, 'post').mockReturnValue(of({ token: 123 }));

    service.register(EMPLOYEES_MOCK[0]).subscribe();
    tick();

    expect(http.post).toHaveBeenCalled();
  }));

  it('should logout', () => {
    const spy = jest.spyOn(global.Storage.prototype, 'removeItem');
    service.logout();
    expect(spy).toHaveBeenCalledWith('token');
  });

  it('should check authentication', () => {
    jest.spyOn(global.Storage.prototype, 'getItem').mockReturnValue('token');
    expect(service.isAuthenticated()).toBeTruthy();
  });
});
