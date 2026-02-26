import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme';
import { OrderService } from '../../services/order'; // ✨ 1. Importar

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.html',
})
export class RegistroComponent {
  // ✨ 2. Asegúrate de que tu objeto user tenga dni y nombreCompleto
  user = {
    userName: '',
    email: '',
    password: '',
    dni: '',
    nombreCompleto: '',
  };

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private orderService: OrderService, // ✨ 3. Inyectar
    private router: Router,
    public themeService: ThemeService,
  ) {}

  // ✨ 4. Función que se dispara al escribir el DNI
  onDniChange(dni: string) {
    if (dni && dni.length === 8) {
      this.orderService.consultarClienteDni(dni).subscribe({
        next: (nombre) => {
          if (nombre !== 'No Encontrado' && nombre !== 'null null null') {
            this.user.nombreCompleto = nombre;
          } else {
            this.user.nombreCompleto = '';
          }
        },
        error: () => (this.user.nombreCompleto = ''),
      });
    } else {
      this.user.nombreCompleto = '';
    }
  }

  onRegister() {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.user).subscribe({
      next: () => {
        this.successMessage = 'Registro exitoso. Redirigiendo...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error || 'Error al registrar la cuenta';
        this.isSubmitting = false;
      },
    });
  }
}
