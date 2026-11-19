import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'sobre',
    loadComponent: () => import('./sobre/sobre.page').then((m) => m.SobrePage),
  },
  {
    path: 'biblioteca',
    loadComponent: () => import('./biblioteca/biblioteca.page').then((m) => m.BibliotecaPage),
  },
  {
    path: 'minha-estante',
    loadComponent: () => import('./minha-estante/minha-estante.page').then((m) => m.MinhaEstantePage),
  },
  {
    path: 'clube',
    loadComponent: () => import('./clube/clube.page').then((m) => m.ClubePage),
  },
];
