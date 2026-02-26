// theme.service.ts
import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Theme = 'light' | 'dark';
const THEME_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  darkModeSignal = signal<Theme>('light');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // 1) Preferencia guardada o sistema
      const saved =
        (localStorage.getItem(THEME_KEY) as Theme) ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light');

      this.darkModeSignal.set(saved);
      this.applyTheme();
    }
  }

  toggleTheme() {
    this.darkModeSignal.update((v) => (v === 'dark' ? 'light' : 'dark'));
    this.applyTheme();
  }

  private applyTheme() {
    if (!isPlatformBrowser(this.platformId)) return;
    const theme = this.darkModeSignal();
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  isDark(): boolean {
    return this.darkModeSignal() === 'dark';
  }
}
