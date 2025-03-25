import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';

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
});
