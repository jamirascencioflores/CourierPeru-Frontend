import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AddressService, Address } from '../../services/address'; // Verifica que la ruta sea correcta
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mis-direcciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mis-direcciones.html',
})
export class MisDireccionesComponent implements OnInit {
  // ✨ Declaraciones vitales para quitar los errores de "Property does not exist"
  direcciones: Address[] = [];
  isSubmitting: boolean = false;

  // Datos maestros de Ubigeo
  ubigeoData: any[] = [];
  departamentos: any[] = [];
  provincias: any[] = [];
  distritos: string[] = [];

  // Objeto vinculado al formulario
  nuevaDireccion: Address = {
    alias: '',
    departamento: '',
    provincia: '',
    distrito: '',
    calle: '',
    referencia: '',
  };

  constructor(
    private http: HttpClient,
    private addressService: AddressService,
  ) {}

  ngOnInit(): void {
    this.http.get<any[]>('peru-ubigeo.json').subscribe((data) => {
      this.ubigeoData = data;
      this.departamentos = data;
    });
    this.cargarDirecciones();
  }

  onDeptoChange() {
    this.provincias = [];
    this.distritos = [];
    this.nuevaDireccion.provincia = '';
    this.nuevaDireccion.distrito = '';

    const deptoEncontrado = this.ubigeoData.find(
      (d) => d.nombre === this.nuevaDireccion.departamento,
    );
    if (deptoEncontrado) {
      this.provincias = deptoEncontrado.provincias;
    }
  }

  onProvinciaChange() {
    this.distritos = [];
    this.nuevaDireccion.distrito = '';

    const provEncontrada = this.provincias.find((p) => p.nombre === this.nuevaDireccion.provincia);
    if (provEncontrada) {
      this.distritos = provEncontrada.distritos;
    }
  }

  cargarDirecciones() {
    this.addressService.getMisDirecciones().subscribe({
      next: (data) => (this.direcciones = data),
      error: (err) => console.error('Error al cargar direcciones', err),
    });
  }

  guardarDireccion() {
    this.isSubmitting = true;
    this.addressService.agregarDireccion(this.nuevaDireccion).subscribe({
      next: (direccionGuardada) => {
        this.direcciones.push(direccionGuardada);
        // ✨ Reset completo del formulario
        this.nuevaDireccion = {
          alias: '',
          departamento: '',
          provincia: '',
          distrito: '',
          calle: '',
          referencia: '',
        };
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error al guardar', err);
        this.isSubmitting = false;
      },
    });
  } 
}
