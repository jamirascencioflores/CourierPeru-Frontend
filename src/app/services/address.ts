import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Address {
  id?: number;
  alias: string;
  calle: string;
  departamento: string;
  provincia: string;
  distrito: string;
  referencia: string;
}

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private apiUrl = 'http://localhost:8080/auth/direcciones';

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');

    // ✨ EXTRAER NOMBRE DE USUARIO DEL JWT
    let username = 'usuario_desconocido';
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Dependiendo de tu backend, puede ser payload.sub o payload.userName
        username = payload.sub || payload.userName || 'usuario_demo';
      } catch (e) {
        console.error('Error decodificando token', e);
      }
    }

    return {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('X-User-Name', username), 
    };
  }

  getMisDirecciones(): Observable<Address[]> {
    return this.http.get<Address[]>(this.apiUrl, this.getHeaders());
  }

  agregarDireccion(direccion: Address): Observable<Address> {
    return this.http.post<Address>(this.apiUrl, direccion, this.getHeaders());
  }

  eliminarDireccion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHeaders());
  }
}
