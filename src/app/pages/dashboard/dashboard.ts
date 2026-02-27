import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme';
import { FooterComponent } from '../../core/footer/footer';
import { OrderService } from '../../services/order';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  userName: string = 'Usuario';
  userRole: string = 'Cliente';
  recentOrders: any[] = [];

  // Valores iniciales en 0
  stats = [
    { title: 'Envíos Activos', value: '0', icon: 'bi-truck', color: 'primary' },
    { title: 'Entregados', value: '0', icon: 'bi-check-circle', color: 'success' },
    { title: 'Pendientes', value: '0', icon: 'bi-clock', color: 'warning' },
    { title: 'Gasto Total', value: 'S/ 0.00', icon: 'bi-wallet2', color: 'info' },
  ];

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router,
    public themeService: ThemeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getRoleFromToken();
    this.extraerNombreDelToken();
    this.cargarOrdenes();
  }

  extraerNombreDelToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        let rawName = payload.sub || payload.userName || 'Usuario';
        this.userName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      } catch (e) {
        console.error('Error decodificando token', e);
      }
    }
  }

  cargarOrdenes() {
    this.orderService.getRecentOrders().subscribe({
      next: (data: any[]) => {
        // 1. Limitamos a los 10 más recientes para el Dashboard
        this.recentOrders = data.sort((a, b) => b.id - a.id).slice(0, 10);

        // 2. Calculamos las estadísticas reales basándonos en TODA la data recibida
        const activas = data.filter((o: any) => o.estado === 'EN_RUTA').length;
        const entregadas = data.filter((o: any) => o.estado === 'ENTREGADO').length;
        const pendientes = data.filter(
          (o: any) => o.estado === 'PENDIENTE' || o.estado === 'PENDIENTE_RECOJO',
        ).length;
        const gastoTotal = data.reduce((sum: number, o: any) => sum + (o.costoEnvio || 0), 0);

        // 3. Actualizamos el array 'stats' que usa tu HTML
        this.stats = [
          {
            title: 'Envíos Activos',
            value: activas.toString(),
            icon: 'bi-truck',
            color: 'primary',
          },
          {
            title: 'Entregados',
            value: entregadas.toString(),
            icon: 'bi-check-circle',
            color: 'success',
          },
          { title: 'Pendientes', value: pendientes.toString(), icon: 'bi-clock', color: 'warning' },
          {
            title: 'Gasto Total',
            value: `S/ ${gastoTotal.toFixed(2)}`,
            icon: 'bi-wallet2',
            color: 'info',
          },
        ];

        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar órdenes', err),
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  avanzarEstado(order: any) {
    let nuevoEstado = 'EN_RUTA';
    if (order.estado === 'EN_RUTA') nuevoEstado = 'ENTREGADO';
    if (order.estado === 'ENTREGADO') return;

    this.orderService.updateEstado(order.id, nuevoEstado).subscribe({
      next: (res: any) => {
        // ✨ Recargamos todo para que se actualicen las tarjetas también
        this.cargarOrdenes();
      },
      error: (err: any) => console.error('Error al avanzar estado', err),
    });
  }

  eliminarOrden(id: number) {
    if (confirm('¿Estás seguro de que deseas cancelar esta orden?')) {
      this.orderService.eliminarOrden(id).subscribe({
        next: () => {
          // ✨ Recargamos todo para actualizar las tarjetas y la tabla
          this.cargarOrdenes();
        },
        error: (err: any) => {
          console.error('Error al eliminar orden', err);
          alert('No se pudo cancelar la orden (probablemente ya no está en estado PENDIENTE).');
        },
      });
    }
  }
}
