import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme'; // <--- IMPORTAR

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  credentials = {
    userName: '',
    password: '',
  };

  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService,
    private cdr: ChangeDetectorRef,
  ) {}

  onLogin() {
    this.errorMessage = ''; // Limpiamos errores previos antes de intentar

    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        let data = typeof res === 'string' ? JSON.parse(res) : res;
        if (data && data.token) {
          localStorage.setItem('token', data.token);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err: any) => {
        console.error('Error en login:', err);

        // 1. Asignamos el mensaje según el status
        if (err.status === 401) {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        } else if (err.status === 0) {
          this.errorMessage = 'No hay conexión con el servidor';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado';
        }

        // 2. ✨ EL TRUCO: Limpiamos la contraseña
        // Al vaciar el modelo, Angular se ve obligado a renderizar de nuevo el formulario
        this.credentials.password = '';

        // 3. Forzamos la detección
        this.cdr.markForCheck(); // Es más eficiente que detectChanges en este caso
        this.cdr.detectChanges();
      },
    });
  }
}
