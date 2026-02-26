import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');

    if (token) return true;

    // Si no hay token, redirigimos explícitamente al login para evitar pantalla blanca
    router.navigate(['/login']);

    if (!state.url.includes('/login') && state.url !== '/') {
      router.navigate(['/login']);
    }
    return false;
  }

  return false;
};
