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
  userName: string = 'Usuario Demo';
  userRole: string = 'Cliente';
  recentOrders: any[] = [];

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
    this.userRole = this.authService.getRoleFromToken();
    this.cargarOrdenes();
  }

  cargarOrdenes() {
    this.orderService.getRecentOrders().subscribe({
      next: (data: any) => {
        this.recentOrders = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar órdenes', err),
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // ✨ Actualizado para usar el nuevo updateEstado
  avanzarEstado(order: any) {
    let nuevoEstado = 'EN_RUTA';
    if (order.estado === 'EN_RUTA') nuevoEstado = 'ENTREGADO';
    if (order.estado === 'ENTREGADO') return; // Ya no avanza más

    this.orderService.updateEstado(order.id, nuevoEstado).subscribe({
      next: (res: any) => {
        order.estado = res.estado;
        this.recentOrders = [...this.recentOrders];
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al avanzar estado', err),
    });
  }

  // ✨ Nuevo método para el botón de cancelar/eliminar del HTML
  eliminarOrden(id: number) {
    if (confirm('¿Estás seguro de que deseas cancelar esta orden?')) {
      this.orderService.eliminarOrden(id).subscribe({
        next: () => {
          this.recentOrders = this.recentOrders.filter((o) => o.id !== id);
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al eliminar orden', err);
          alert('No se pudo cancelar la orden (probablemente ya no está en estado PENDIENTE).');
        },
      });
    }
  }
}
