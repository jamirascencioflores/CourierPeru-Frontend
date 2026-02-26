import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// ✨ 1. Agrega withFetch a la importación:
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { authInterceptor } from './core/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // ✨ 2. Coloca withFetch() junto a tu interceptor:
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  ],
};
