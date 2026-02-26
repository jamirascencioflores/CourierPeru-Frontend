import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  // Función ayudante para crear la cabecera con el token
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  getRecentOrders(): Observable<any[]> {
    // Mandamos los headers en la petición GET
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  crearOrden(orden: any): Observable<any> {
    // Mandamos los headers en la petición POST también
    return this.http.post(this.apiUrl, orden, { headers: this.getHeaders() });
  }

  avanzarEstado(id: number): Observable<any> {
    // Asegúrate de que this.apiUrl sea 'http://localhost:8081/api/orders'
    return this.http.put(`${this.apiUrl}/${id}/estado`, {});
  }

  rastrearPedido(codigo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tracking/${codigo}`);
  }

  obtenerTodasLasOrdenes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); // Apunta a http://localhost:8080/api/orders
  }

  consultarClienteDni(dni: string) {
    return this.http.get(`${this.apiUrl}/cliente/${dni}`, { responseType: 'text' });
  }
}
