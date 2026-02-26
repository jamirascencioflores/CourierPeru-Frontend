import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // URL del Gateway
  private apiUrl = 'http://localhost:8080/auth';

  // Inyectamos el ID de la plataforma para proteger el SSR
  private platformId = inject(PLATFORM_ID);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl + '/login', credentials, { responseType: 'text' }).pipe(
      tap((token) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', token);
        }
      }),
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/login']);
  }

  // --- NUEVAS FUNCIONES PARA LEER EL TOKEN ---

  getRoleFromToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');

      // ✨ SEGURIDAD: Validamos que tenga las 3 partes de un JWT
      if (token && token.split('.').length === 3) {
        try {
          const payload = token.split('.')[1];
          const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
          const decoded = JSON.parse(window.atob(base64));

          let role =
            decoded.role || decoded.roles || decoded.authorities || decoded.scope || 'USER';

          if (Array.isArray(role) && role.length > 0) {
            role = role[0].authority || role[0].name || role[0];
          }

          if (typeof role === 'string' && role.startsWith('ROLE_')) {
            role = role.substring(5);
          }

          return typeof role === 'string' ? role.toUpperCase() : 'USER';
        } catch (error) {
          console.error('❌ Error al decodificar token', error);
        }
      }
    }
    return 'USER';
  }

  getUsernameFromToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = token.split('.')[1];
          const decoded = JSON.parse(atob(payload));
          // 'sub' es el estándar en JWT para el subject (usuario), o 'username'
          return decoded.sub || decoded.username || 'Usuario';
        } catch (error) {
          console.error('Error al decodificar token', error);
        }
      }
    }
    return 'Usuario';
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, { responseType: 'text' });
  }

  getProfile(): Observable<any> {
    let token = '';

    // Validamos que estemos en el navegador para usar localStorage
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/perfil`, { headers });
  }
}
