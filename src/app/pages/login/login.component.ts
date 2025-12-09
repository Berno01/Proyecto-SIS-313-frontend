import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  /**
   * Maneja el envío del formulario de login
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (usuario) => {
        console.log('Login exitoso:', usuario);
        this.router.navigate(['/dashboard-flash']);
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage =
            'Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.';
        } else if (error.status === 400) {
          this.errorMessage = 'Datos inválidos. Por favor, completa todos los campos.';
        } else {
          this.errorMessage = 'Error de conexión. Por favor, intenta nuevamente.';
        }
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  /**
   * Verifica si un campo tiene error y fue tocado
   */
  hasError(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
