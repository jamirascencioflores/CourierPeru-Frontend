import { Component, AfterViewInit, inject, PLATFORM_ID, signal } from '@angular/core'; // ✨ Importamos signal
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme';
import { ShippingService } from '../../services/shipping';
import { OrderService } from '../../services/order'; // Asegúrate de la ruta correcta

declare var bootstrap: any;

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
})
export class LandingComponent implements AfterViewInit {
  // ✨ 1. Convertimos las variables "rebeldes" en Señales
  pesoCotizar = signal<number | null>(null);
  costoEstimado = signal<number | null>(null);
  cargandoCosto = signal<boolean>(false);
  ordenRastreada = signal<any>(null);
  errorRastreo = signal<boolean>(false);
  trackingCode = '';
  private platformId = inject(PLATFORM_ID);

  constructor(
    private router: Router,
    public themeService: ThemeService,
    private shippingService: ShippingService,
    private orderService: OrderService, // Asegúrate de inyectar el OrderService
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const modalElement = document.getElementById('promoModal');
        if (modalElement) {
          const promoModal = new bootstrap.Modal(modalElement);
          promoModal.show();
        }
      }, 1000);
    }
  }

  rastrear() {
    if (this.trackingCode.trim().length === 0) {
      alert('⚠️ Por favor ingresa un código de seguimiento.');
      return;
    }

    this.errorRastreo.set(false); // Limpiamos errores previos
    this.ordenRastreada.set(null); // Limpiamos busquedas previas

    this.orderService.rastrearPedido(this.trackingCode).subscribe({
      next: (res) => {
        // ✨ MAGIA: Usamos set() para forzar el repintado
        this.ordenRastreada.set(res);
      },
      error: (err) => {
        console.error(err);
        this.errorRastreo.set(true);
      },
    });
  }
  cotizarEnvio() {
    const pesoActual = this.pesoCotizar(); // ✨ Leemos el valor de la señal
    if (!pesoActual || pesoActual <= 0) return;

    this.cargandoCosto.set(true); // ✨ Activamos estado de carga

    this.shippingService.calcularCosto(pesoActual).subscribe({
      next: (res) => {
        console.log('✅ Data recibida del MS-Shipping:', res);
        this.costoEstimado.set(res.costo); // ✨ Actualizamos el costo (Garantiza el repintado)
        this.cargandoCosto.set(false);
      },
      error: (err) => {
        console.error('❌ Error al cotizar', err);
        this.cargandoCosto.set(false);
      },
    });
  }
}
