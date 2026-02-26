// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';
import { FooterComponent } from './core/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NgIf, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {
  isFooterGlobalVisible = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const url = e.urlAfterRedirects;
        const isLogin = url.startsWith('/login');
        const isDashboard = url.startsWith('/dashboard');
        const isOrder = url.includes('/order-create');
        this.isFooterGlobalVisible = !(isLogin || isDashboard || isOrder);
      });
  }
}
