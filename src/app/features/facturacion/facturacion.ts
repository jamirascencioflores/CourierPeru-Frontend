import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from './../../services/order';

@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './facturacion.html',
  styleUrls: ['./facturacion.css'],
})
export class FacturacionComponent implements OnInit {
  private orderService = inject(OrderService);

  ordenes = signal<any[]>([]);
  ordenSeleccionada = signal<any | null>(null);

  ngOnInit() {
    this.orderService.obtenerTodasLasOrdenes().subscribe({
      next: (data: any[]) => this.ordenes.set(data.sort((a, b) => b.id - a.id)),
      error: (err: any) => console.error(err),
    });
  }

  verBoleta(orden: any) {
    this.ordenSeleccionada.set(orden);
  }

  cerrarBoleta() {
    this.ordenSeleccionada.set(null);
  }

  imprimir() {
    window.print();
  }
}
