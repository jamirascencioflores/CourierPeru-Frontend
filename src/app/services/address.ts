import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  // Asegúrate de que el puerto coincida con tu API Gateway (usualmente 8080)
  private apiUrl = 'http://localhost:8080/auth/direcciones';

  constructor(private http: HttpClient) {}

  getMisDirecciones(): Observable<Address[]> {
    return this.http.get<Address[]>(this.apiUrl);
  }

  agregarDireccion(direccion: Address): Observable<Address> {
    return this.http.post<Address>(this.apiUrl, direccion);
  }
}
