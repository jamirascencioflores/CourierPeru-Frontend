import { OrderService } from './../../services/order';
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-gestion-ordenes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gestion-ordenes.html',
  styleUrls: ['./gestion-ordenes.css'],
})
export class GestionOrdenesComponent implements OnInit {
  private orderService = inject(OrderService);

  // --- Señales de Datos ---
  ordenes = signal<any[]>([]);
  terminoBusqueda = signal<string>('');
  cargando = signal<boolean>(true);

  // --- Señales de Paginación ---
  paginaActual = signal<number>(1);
  itemsPorPagina = 10;
  protected readonly Math = Math; // Para usar en el HTML

  ordenEnEdicion: any = {};
  guardandoEdicion = false;
  userRole: string = 'USER';

  // 1. Primero filtramos por búsqueda
  ordenesFiltradas = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase();
    const todas = this.ordenes();

    if (!termino) return todas;

    return todas.filter((orden) => {
      const tracking = orden.codigoRastreo ? String(orden.codigoRastreo).toLowerCase() : '';
      const dni = orden.dniCliente ? String(orden.dniCliente).toLowerCase() : '';
      return tracking.includes(termino) || dni.includes(termino);
    });
  });

  // 2. Luego paginamos el resultado filtrado
  ordenesPaginadas = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.ordenesFiltradas().slice(inicio, fin);
  });

  // 3. Calculamos total de páginas
  totalPaginas = computed(() => {
    return Math.ceil(this.ordenesFiltradas().length / this.itemsPorPagina);
  });

  ngOnInit(): void {
    this.extraerRolDelToken();
    this.cargarOrdenes();
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas()) {
      this.paginaActual.set(nuevaPagina);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  extraerRolDelToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const payloadStr = JSON.stringify(payload).toUpperCase();
        this.userRole = payloadStr.includes('ADMIN') ? 'ADMIN' : 'USER';
      } catch (e) {
        console.error('Error decodificando token', e);
      }
    }
  }

  cargarOrdenes() {
    this.cargando.set(true);
    this.orderService.obtenerTodasLasOrdenes().subscribe({
      next: (data: any[]) => {
        this.ordenes.set(data.sort((a, b) => b.id - a.id));
        this.paginaActual.set(1);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  puedeEditarOEliminar(orden: any): boolean {
    return this.userRole === 'ADMIN' || (this.userRole === 'USER' && orden.estado === 'PENDIENTE');
  }

  abrirModalEditar(orden: any) {
    this.ordenEnEdicion = { ...orden };
    const modalElement = document.getElementById('modalEditarOrden');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  guardarEdicion() {
    this.guardandoEdicion = true;
    this.orderService.editarOrden(this.ordenEnEdicion.id, this.ordenEnEdicion).subscribe({
      next: (res: any) => {
        this.ordenes.update((list) => list.map((o) => (o.id === res.id ? res : o)));
        this.guardandoEdicion = false;
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarOrden'));
        modal?.hide();
      },
      error: () => (this.guardandoEdicion = false),
    });
  }

  avanzarEstado(order: any) {
    let nuevoEstado = order.estado === 'PENDIENTE' ? 'EN_RUTA' : 'ENTREGADO';
    this.orderService.updateEstado(order.id, nuevoEstado).subscribe({
      next: (res: any) =>
        this.ordenes.update((list) => list.map((o) => (o.id === order.id ? res : o))),
    });
  }

  eliminarOrden(id: number) {
    if (confirm('¿Eliminar esta orden?')) {
      this.orderService.eliminarOrden(id).subscribe({
        next: () => this.ordenes.update((list) => list.filter((o) => o.id !== id)),
      });
    }
  }

  getColorEstado(estado: string): string {
    if (estado === 'PENDIENTE') return 'bg-secondary';
    if (estado === 'EN_RUTA') return 'bg-warning text-dark';
    return 'bg-success';
  }
}
