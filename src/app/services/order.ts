import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

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
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  crearOrden(orden: any): Observable<any> {
    return this.http.post(this.apiUrl, orden, { headers: this.getHeaders() });
  }

  // ✨ CORREGIDO: Ya tiene las cabeceras para que no te bote el 401
  obtenerTodasLasOrdenes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // ✨ ACTUALIZADO: Para cambiar a cualquier estado (PENDIENTE, EN_RUTA, etc.)
  updateEstado(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estado`, estado, { headers: this.getHeaders() });
  }

  // ✨ NUEVO: El método para cancelar/eliminar la orden
  eliminarOrden(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  rastrearPedido(codigo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tracking/${codigo}`, { headers: this.getHeaders() });
  }

  consultarClienteDni(dni: string) {
    return this.http.get(`${this.apiUrl}/cliente/${dni}`, {
      responseType: 'text',
      headers: this.getHeaders(),
    });
  }
}
