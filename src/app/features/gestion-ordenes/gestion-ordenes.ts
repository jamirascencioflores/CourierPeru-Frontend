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

  avanzarEstado(order: any) {
    // Definimos la lógica de avance de estados
    let nuevoEstado = 'EN_RUTA';
    if (order.estado === 'EN_RUTA') nuevoEstado = 'ENTREGADO';
    if (order.estado === 'ENTREGADO') {
      alert('Esta orden ya ha sido entregada.');
      return;
    }

    if (confirm(`¿Estás seguro de cambiar el estado a ${nuevoEstado}? Se notificará al cliente.`)) {
      // ✨ Usamos updateEstado en lugar de avanzarEstado
      this.orderService.updateEstado(order.id, nuevoEstado).subscribe({
        next: (ordenActualizada: any) => {
          // Actualizamos la lista usando signals o arreglos normales según tu código
          const listaActualizada = this.ordenes().map((o: any) =>
            o.id === order.id ? ordenActualizada : o,
          );
          this.ordenes.set(listaActualizada);
          alert('✅ Estado actualizado y notificación enviada.');
        },
        error: (err: any) => {
          console.error(err);
          alert('❌ Hubo un error al actualizar el estado: ' + (err.error || 'Acceso denegado'));
        },
      });
    }
  }

  // ✨ Tip extra: Agrega el método para eliminar aquí también si lo necesitas
  eliminarOrden(id: number) {
    if (confirm('¿Estás seguro de eliminar esta orden permanentemente?')) {
      this.orderService.eliminarOrden(id).subscribe({
        next: () => {
          const listaActualizada = this.ordenes().filter((o: any) => o.id !== id);
          this.ordenes.set(listaActualizada);
          alert('✅ Orden eliminada correctamente.');
        },
        error: (err: any) => {
          console.error(err);
          alert('❌ No se pudo eliminar la orden.');
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
