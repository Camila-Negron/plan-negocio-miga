import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'planes',
    loadComponent: () =>
      import('./plans/planes/planes').then((m) => m.PlanesComponent),
    canActivate: [() =>
      import('./core/auth.guard').then((m) => m.authGuard)],
  },
  {
    path: 'idea',
    loadComponent: () =>
      import('./features/idea/idea').then((m) => m.IdeaComponent),
  },
  {
    path: 'objetivo',
    loadComponent: () =>
      import('./features/objetivo/objetivo').then((m) => m.ObjetivoComponent),
  },
  {
    path: 'costos',
    loadComponent: () =>
      import('./features/costos/costos').then((m) => m.CostosComponent),
    children: [
      {
        path: 'materia-prima',
        loadComponent: () =>
          import('./features/costos/materia-prima.component').then(
            (m) => m.MateriaPrimaComponent
          ),
      },
      {
        path: 'mano-de-obra',
        loadComponent: () =>
          import('./features/costos/mano-de-obra').then(
            (m) => m.ManoDeObraComponent
          ),
      },
      {
        path: 'costos-indirectos',
        loadComponent: () =>
          import('./features/costos/costos-indirectos').then(
            (m) => m.CostosIndirectosComponent
          ),
      },
      {
        path: 'resumen',
        loadComponent: () =>
          import('./features/costos/resumen-costos').then(
            (m) => m.ResumenCostosComponent
          ),
      },
      {
        path: '',
        redirectTo: 'materia-prima',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '**',
    redirectTo: 'planes',
  },
];
