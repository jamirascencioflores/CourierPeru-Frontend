import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private cdr: ChangeDetectorRef,
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
      next: (data) => {
        console.log('Datos recibidos:', data);
        // ✨ IMPORTANTE: Asignamos los datos a la variable que recorre el *ngFor
        this.direcciones = data;

        // Forzamos la detección de cambios si es necesario
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar direcciones', err);
      },
    });
  }

  guardarDireccion() {
    this.isSubmitting = true;
    this.addressService.agregarDireccion(this.nuevaDireccion).subscribe({
      next: (res) => {
        console.log('Dirección guardada:', res);
        this.isSubmitting = false;

        // ✨ LIMPIAMOS EL FORMULARIO
        this.nuevaDireccion = {
          alias: '',
          calle: '',
          departamento: '',
          provincia: '',
          distrito: '',
          referencia: '',
        };

        // ✨ RECARGAMOS LA LISTA PARA QUE APAREZCA LA NUEVA CARD
        this.cargarDirecciones();

        alert('Dirección agregada con éxito');
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error al guardar', err);
      },
    });
  }

  eliminarDireccion(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
      this.addressService.eliminarDireccion(id).subscribe({
        next: () => {
          this.direcciones = this.direcciones.filter((d) => d.id !== id);

          this.cdr.detectChanges();

          console.log('Dirección eliminada y vista actualizada');
        },
        error: (err) => {
          console.error('Error al eliminar la dirección', err);
          alert('No se pudo eliminar la dirección.');
        },
      });
    }
  }
}
