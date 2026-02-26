import { OrderService } from './../../services/order';
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gestion-ordenes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gestion-ordenes.html',
  styleUrls: ['./gestion-ordenes.css'],
})
export class GestionOrdenesComponent implements OnInit {
  private orderService = inject(OrderService); // public themeService = inject(ThemeServicemeService); // Descomenta si usas dark mode

  // Señales
  ordenes = signal<any[]>([]);
  terminoBusqueda = signal<string>('');
  cargando = signal<boolean>(true);

  // Señal Computada: Filtra automáticamente por Tracking o DNI
  ordenesFiltradas = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase();
    if (!termino) return this.ordenes();

    return this.ordenes().filter((orden) => {
      const tracking = orden.codigoRastreo ? String(orden.codigoRastreo).toLowerCase() : '';
      const dni = orden.dniCliente ? String(orden.dniCliente).toLowerCase() : '';

      return tracking.includes(termino) || dni.includes(termino);
    });
  });

  ngOnInit(): void {
    this.cargarOrdenes();
  }

  cargarOrdenes() {
    this.cargando.set(true);
    this.orderService.obtenerTodasLasOrdenes().subscribe({
      // ✨ Agregamos ": any[]" a data
      next: (data: any[]) => {
        // ✨ Agregamos ": any" a las variables a y b
        const ordenadas = data.sort((a: any, b: any) => b.id - a.id);
        this.ordenes.set(ordenadas);
        this.cargando.set(false);
      },
      // ✨ Agregamos ": any" a err
      error: (err: any) => {
        console.error('Error al cargar órdenes', err);
        this.cargando.set(false);
      },
    });
  }

  avanzarEstado(id: number) {
    if (confirm('¿Estás seguro de avanzar el estado de esta orden? Se notificará al cliente.')) {
      this.orderService.avanzarEstado(id).subscribe({
        // ✨ Agregamos ": any" a ordenActualizada
        next: (ordenActualizada: any) => {
          const listaActualizada = this.ordenes().map((o) => (o.id === id ? ordenActualizada : o));
          this.ordenes.set(listaActualizada);
          alert('✅ Estado actualizado y notificación enviada.');
        },
        // ✨ Agregamos ": any" a err
        error: (err: any) => {
          console.error(err);
          alert('❌ Hubo un error al actualizar el estado.');
        },
      });
    }
  }

  // Método auxiliar para pintar colores según el estado
  getColorEstado(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-secondary';
      case 'EN_RUTA':
        return 'bg-warning text-dark';
      case 'ENTREGADO':
        return 'bg-success';
      default:
        return 'bg-primary';
    }
  }
}
