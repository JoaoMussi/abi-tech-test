import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { take } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { LoginForm } from '../../interfaces/login-form.interface';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    InputText,
    CardModule,
    ButtonModule,
    PasswordModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup<LoginForm>;
  loading = signal(false);

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup<LoginForm>({
      email: new FormControl<string | null>('', Validators.required),
      password: new FormControl<string | null>('', Validators.required),
    });
  }

  register(): void {
    this.router.navigate(['/register']);
  }

  login(): void {
    if (!this.loginForm.valid) return;
    this.loading.set(true);
    const { email, password } = this.loginForm.getRawValue();
    this.authService
      .login(email!, password!)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
}
