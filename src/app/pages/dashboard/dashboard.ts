import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // <--- IMPORTANTE: Importar RouterLink
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme';
import { FooterComponent } from '../../core/footer/footer';
import { OrderService } from '../../services/order';
import { ChangeDetectorRef } from '@angular/core'; // <--- IMPORTANTE: Importar ChangeDetectorRef

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent], // <--- IMPORTANTE: Agregarlo aquí
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  userName: string = 'Usuario Demo';
  userRole: string = 'Cliente'; // Simulación: Cambia a 'ADMIN' para probar
  recentOrders: any[] = [];
  // Esto llena las tarjetas de colores
  stats = [
    { title: 'Envíos Activos', value: '12', icon: 'bi-truck', color: 'primary' },
    { title: 'Entregados', value: '45', icon: 'bi-check-circle', color: 'success' },
    { title: 'Pendientes', value: '3', icon: 'bi-clock', color: 'warning' },
    { title: 'Gasto Mensual', value: 'S/ 340', icon: 'bi-wallet2', color: 'info' },
  ];

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router,
    public themeService: ThemeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // 1. Leemos el rol automáticamente del Token
    this.userRole = this.authService.getRoleFromToken();

    // Opcional: Si el JWT también tiene el nombre de usuario, podrías sacarlo igual
    // this.userName = this.authService.getUsernameFromToken();

    // 2. Cargamos las órdenes
    this.cargarOrdenes();
  }

  cargarOrdenes() {
    this.orderService.getRecentOrders().subscribe({
      next: (data) => {
        this.recentOrders = data;
        this.cdr.detectChanges(); // Asegura que Angular actualice la vista después de cargar las órdenes
      },
      error: (err) => console.error('Error al cargar órdenes', err),
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); // Vuelve al Landing Page
  }

  avanzarEstado(order: any) {
    this.orderService.avanzarEstado(order.id).subscribe({
      next: (res) => {
        // 1. Actualizamos el estado
        order.estado = res.estado;

        // 2. Clonamos el arreglo para que Angular detecte un "nuevo" arreglo y redibuje la tabla
        this.recentOrders = [...this.recentOrders];

        // 3. Forzamos la detección de cambios al instante
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al avanzar estado', err),
    });
  }
}
