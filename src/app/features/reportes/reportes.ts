import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from './../../services/order';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css'], // Si tienes el archivo css
})
export class ReportesComponent implements OnInit {
  private orderService = inject(OrderService);

  // Estado
  ordenes = signal<any[]>([]);
  cargando = signal<boolean>(true);

  // 📊 MÉTRICAS CALCULADAS AUTOMÁTICAMENTE (KPIs)
  totalIngresos = computed(() =>
    this.ordenes().reduce((sum, orden) => sum + (orden.costoEnvio || 0), 0),
  );

  totalOrdenes = computed(() => this.ordenes().length);

  entregados = computed(() => this.ordenes().filter((o) => o.estado === 'ENTREGADO').length);
  enRuta = computed(() => this.ordenes().filter((o) => o.estado === 'EN_RUTA').length);
  pendientes = computed(() => this.ordenes().filter((o) => o.estado === 'PENDIENTE').length);

  // Porcentajes para la interfaz
  progresoEntregados = computed(() =>
    this.totalOrdenes() === 0 ? 0 : Math.round((this.entregados() / this.totalOrdenes()) * 100),
  );

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando.set(true);
    this.orderService.obtenerTodasLasOrdenes().subscribe({
      next: (data: any[]) => {
        this.ordenes.set(data);
        this.cargando.set(false);
      },
      error: (err: any) => {
        console.error('Error al cargar reportes', err);
        this.cargando.set(false);
      },
    });
  }

  imprimirReporte() {
    window.print(); // Función nativa para exportar a PDF / Imprimir
  }
}
