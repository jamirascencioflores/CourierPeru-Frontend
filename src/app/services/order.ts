import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  // Definimos explícitamente el tipo de retorno para ayudar a TypeScript
  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    let username = 'desconocido';
    let role = 'USER';

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        username = payload.sub || payload.userName || 'usuario_demo';
        const payloadStr = JSON.stringify(payload).toUpperCase();
        role = payloadStr.includes('ADMIN') ? 'ADMIN' : 'USER';
      } catch (e) {
        console.error('Error decodificando token', e);
      }
    }

    return {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('X-User-Name', username)
        .set('X-User-Role', role),
    };
  }

  getRecentOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHeaders());
  }

  crearOrden(orden: any): Observable<any> {
    return this.http.post(this.apiUrl, orden, this.getHeaders());
  }

  obtenerTodasLasOrdenes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHeaders());
  }

  updateEstado(id: number, estado: string): Observable<any> {
    // ✨ Enviamos como JSON { estado: "EN_RUTA" } para que Spring lo entienda
    const body = { estado: estado };
    return this.http.put(`${this.apiUrl}/${id}/estado`, body, this.getHeaders());
  }

  eliminarOrden(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  rastrearPedido(codigo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tracking/${codigo}`, this.getHeaders());
  }

  consultarClienteDni(dni: string) {
    // Usamos el operador spread (...) para combinar los headers y el responseType
    return this.http.get(`${this.apiUrl}/cliente/${dni}`, {
      ...this.getHeaders(),
      responseType: 'text',
    });
  }

  editarOrden(id: number, orden: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, orden, this.getHeaders());
  }
}
