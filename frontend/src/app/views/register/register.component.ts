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
      name: new FormControl<string>('Jon', Validators.required),
      lastName: new FormControl<string>('Doe', Validators.required),
      email: new FormControl<string>(
        'jon.doe@example.com',
        Validators.required
      ),
      documentCode: new FormControl<string>('DOC333', Validators.required),
      role: new FormControl<string>('Leader', Validators.required),
      managerName: new FormControl<string>(''),
      birthDate: new FormControl<Date | null>(new Date(2000, 0, 0), [
        Validators.required,
        minAgeValidator(),
      ]),
      phone: new FormControl<string | null>('99999999', Validators.required),
      password: new FormControl<string | null>('123', Validators.required),
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
