import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // ✨ 1. Importar ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme';
import { OrderService } from '../../services/order';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css'],
})
export class PerfilComponent implements OnInit {
  userProfile: any = null;
  isLoading = true;
  error = '';

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    public themeService: ThemeService,
    private cdr: ChangeDetectorRef // 
  ) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data: any) => {
        console.log('Datos del perfil recibidos:', data); 
        this.userProfile = data;
        this.isLoading = false;
        
        this.cdr.detectChanges(); // ✨ 3. Forzar a Angular a actualizar el HTML
      },
      error: (err: any) => {
        this.error = 'No se pudo cargar la información del perfil.';
        this.isLoading = false;
        
        this.cdr.detectChanges(); // ✨ Forzar aquí también
      },
    });
  }
}