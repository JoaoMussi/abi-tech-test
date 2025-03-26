import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { EmployeeForm } from '../../interfaces/employee-form.interface';
import { minAgeValidator } from '../../shared/validators/min-age.validator';
import { AuthService } from '../../core/services/auth.service';
import { catchError, take } from 'rxjs';
import { Employee } from '../../interfaces/employee.interface';
import { Router } from '@angular/router';
import { EmployeeFormComponent } from '../../components/employee-form/employee-form.component';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-register',
  imports: [ButtonModule, CardModule, EmployeeFormComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup<EmployeeForm>;
  loading = signal(false);

  constructor(private authService: AuthService, private router: Router) {
    this.registerForm = new FormGroup<EmployeeForm>({
      name: new FormControl<string>('', Validators.required),
      lastName: new FormControl<string>('', Validators.required),
      email: new FormControl<string>('', Validators.required),
      documentCode: new FormControl<string>('', Validators.required),
      role: new FormControl<string>('', Validators.required),
      managerName: new FormControl<string>(''),
      birthDate: new FormControl<Date | null>(new Date(), [
        Validators.required,
        minAgeValidator(),
      ]),
      phone: new FormControl<string | null>('', Validators.required),
      password: new FormControl<string | null>('', Validators.required),
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  register(): void {
    if (!this.registerForm.valid) return;
    this.loading.set(true);

    const employee: Employee = this.registerForm.getRawValue() as Employee;
    this.authService
      .register(employee)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.authService
            .login(employee.email, employee.password!)
            .pipe(take(1))
            .subscribe(() => {
              this.loading.set(false);
              this.router.navigate(['/']);
            });
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
}
