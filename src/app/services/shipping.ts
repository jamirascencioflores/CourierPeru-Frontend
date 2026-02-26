import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  // Asegúrate de poner el puerto correcto de tu ms-shipping (ej. 8082)
  private apiUrl = 'http://localhost:8080/api/shipping';

  constructor(private http: HttpClient) {}

  calcularCosto(peso: number): Observable<any> {
    // Ajusta la ruta según cómo esté tu controlador en Spring Boot
    return this.http.get(`${this.apiUrl}/calcular?peso=${peso}`);
  }
}
