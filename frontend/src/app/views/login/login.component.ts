import { Component, signal } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginForm } from '../../interfaces/login-form.interface';
import { AuthService } from '../../core/services/auth.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputText, CardModule, ButtonModule],
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
