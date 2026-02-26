import { Component } from '@angular/core';
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

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService,
  ) {}

  onLogin() {
    this.authService.login(this.credentials).subscribe({
      next: (token) => {
        console.log('Login exitoso');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Credenciales incorrectas';
      },
    });
  }
}
