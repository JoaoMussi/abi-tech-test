import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let authService: AuthService;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            register: () => of(undefined),
            login: () => of(undefined),
          },
        },
      ],
      imports: [RegisterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    authService = TestBed.inject(AuthService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prevent register', () => {
    jest.spyOn(authService, 'register');
    component.register();
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('should register employee', fakeAsync(() => {
    jest.spyOn(authService, 'register');
    jest.spyOn(authService, 'login');
    jest.spyOn(component.loading, 'set');
    component.registerForm.setValue({
      name: 'Jon',
      lastName: 'Doe',
      email: 'jon@doe.com',
      documentCode: '123456789',
      role: 'Any Role',
      managerName: '',
      birthDate: new Date(2000, 1, 1),
      hiringDate: new Date(),
      salary: null,
      password: '123',
      phone: '999999999',
    });
    const formValue = component.registerForm.getRawValue();

    component.register();
    tick();

    expect(authService.register).toHaveBeenCalledWith(formValue);
    expect(authService.login).toHaveBeenCalledWith(
      formValue.email,
      formValue.password
    );
    expect(component.loading.set).toHaveBeenCalledWith(false);
  }));
});
