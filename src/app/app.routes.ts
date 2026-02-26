import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { authGuard } from './core/auth.guard';
import { LandingComponent } from './pages/landing/landing';
import { OrderCreateComponent } from './pages/order-create/order-create';
import { GestionOrdenesComponent } from './features/gestion-ordenes/gestion-ordenes';
import { ReportesComponent } from './features/reportes/reportes';
import { FacturacionComponent } from './features/facturacion/facturacion';
import { PerfilComponent } from './features/perfil/perfil';
import { RegistroComponent } from './auth/registro/registro';

export const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'order-create', component: OrderCreateComponent, canActivate: [authGuard] },
  { path: 'nueva-orden', redirectTo: 'order-create', pathMatch: 'full' },

  { path: 'gestion-ordenes', component: GestionOrdenesComponent, canActivate: [authGuard] },
  { path: 'reportes', component: ReportesComponent, canActivate: [authGuard] },
  { path: 'facturacion', component: FacturacionComponent, canActivate: [authGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '' },
];
