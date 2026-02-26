import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order';
import { ThemeService } from '../../services/theme';
import { AuthService } from '../../services/auth'; // <-- Ajusta la ruta si tu auth.service está en otra carpeta

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './order-create.html',
})
export class OrderCreateComponent implements OnInit {
  orderForm: FormGroup;
  isSubmitting = false;
  userRole: string = ''; // ✨ 1. Variable declarada

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router,
    public themeService: ThemeService,
    private authService: AuthService, // ✨ 2. Servicio inyectado
  ) {
    this.orderForm = this.fb.group({
      dniCliente: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      direccionRecojo: ['', Validators.required],
      direccionEntrega: ['', Validators.required],
      pesoPaquete: ['', [Validators.required, Validators.min(0.1)]],
      costoEnvio: [{ value: '', disabled: true }], // Se calculará automáticamente
      nombreCompleto: [''],
    });

    // Simular cálculo de costo al cambiar el peso
    this.orderForm.get('pesoPaquete')?.valueChanges.subscribe((peso) => {
      const costo = peso ? peso * 5 + 10 : 0; // Fórmula de ejemplo: 10 base + 5 por Kg
      this.orderForm.patchValue({ costoEnvio: costo }, { emitEvent: false });
    });
  }

  ngOnInit(): void {
    this.userRole = this.authService.getRoleFromToken();

    this.orderForm.get('dniCliente')?.valueChanges.subscribe((dni) => {
      if (dni && dni.length === 8) {
        this.orderService.consultarClienteDni(dni).subscribe({
          next: (nombre) => {
            if (nombre !== 'No Encontrado' && nombre !== 'null null null') {
              this.orderForm.patchValue({ nombreCompleto: nombre });
            }
          },
          error: (err) => console.error('Error al consultar DNI', err),
        });
      }
    });
  }

  onSubmit() {
    if (this.orderForm.invalid) return;

    this.isSubmitting = true;
    const orderData = this.orderForm.getRawValue(); // getRawValue incluye campos disabled (costoEnvio)

    this.orderService.crearOrden(orderData).subscribe({
      next: (res) => {
        alert('✅ ¡Orden creada con éxito! Rastreo: ' + res.codigoRastreo);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error al crear la orden');
        this.isSubmitting = false;
      },
    });
  }
}
