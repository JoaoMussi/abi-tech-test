import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { of, throwError } from 'rxjs';
import { provideRouter, Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: AuthService;
  let router: Router;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { login: () => of(undefined) } },
      ],
      imports: [LoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should avoid login when form is invalid', () => {
    jest.spyOn(authService, 'login');
    component.login();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should login', fakeAsync(() => {
    jest.spyOn(authService, 'login');
    jest.spyOn(component.loading, 'set');
    jest.spyOn(router, 'navigate');
    component.loginForm.setValue({
      email: 'jon.doe@example.com',
      password: '123456',
    });

    component.login();
    tick();

    expect(authService.login).toHaveBeenCalled();
    expect(component.loading.set).toHaveBeenCalledWith(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should prevent redirect when login failed', fakeAsync(() => {
    jest
      .spyOn(authService, 'login')
      .mockImplementation(() => throwError(() => new Error()));
    jest.spyOn(component.loading, 'set');
    jest.spyOn(router, 'navigate');
    component.loginForm.setValue({
      email: 'jon.doe@example.com',
      password: '123456',
    });

    component.login();
    tick();

    expect(authService.login).toHaveBeenCalled();
    expect(component.loading.set).toHaveBeenCalledWith(false);
    expect(router.navigate).not.toHaveBeenCalledWith(['/']);
  }));
});
