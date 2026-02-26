import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // ✨ Necesario para routerLink
import { CommonModule } from '@angular/common'; // ✨ Necesario para *ngIf y ngClass
import { FormsModule } from '@angular/forms'; // ✨ Necesario para [(ngModel)]
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme'; // Asegúrate de que esta ruta sea correcta

@Component({
  selector: 'app-registro',
  standalone: true, // ✨ Le dice a Angular que este componente importa sus propias cosas
  imports: [CommonModule, FormsModule, RouterModule], // ✨ Aquí inyectamos los módulos
  templateUrl: './registro.html', // (Asegúrate de que coincida con el nombre de tu archivo html)
  styleUrls: ['./registro.css'], // (Asegúrate de que coincida con el nombre de tu archivo css)
})
export class RegistroComponent {
  user = {
    userName: '',
    email: '',
    password: '',
  };

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService,
  ) {}

  onRegister() {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.user).subscribe({
      next: (res) => {
        this.successMessage = '¡Cuenta creada con éxito! Redirigiendo al login...';
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = 'Hubo un error al registrar. Intenta con otro usuario o correo.';
        this.isSubmitting = false;
      },
    });
  }
}
