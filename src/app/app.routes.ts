import { Routes } from '@angular/router';
import { authGuard } from './services/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./layout').then(m => m.DefaultLayoutComponent),
    canActivate: [authGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'clientes',
        loadChildren: () => import('./views/clientes/routes').then((m) => m.routes)
      },
      {
        path: 'equipamentos',
        loadChildren: () => import('./views/equipamentos/routes').then((m) => m.routes)
      },
      {
        path: 'produtos',
        loadChildren: () => import('./views/produtos/routes').then((m) => m.routes)
      },
      {
        path: 'vendas',
        loadChildren: () => import('./views/vendas/routes').then((m) => m.routes)
      },
      {
        path: 'servicos',
        loadChildren: () => import('./views/servicos/routes').then((m) => m.routes)
      },
      {
        path: 'planos-assinatura',
        loadChildren: () => import('./views/planos-assinatura/routes').then((m) => m.routes)
      },
      {
        path: 'assinaturas',
        loadChildren: () => import('./views/assinaturas/routes').then((m) => m.routes)
      },
      {
        path: 'fornecedores',
        loadChildren: () => import('./views/fornecedores/routes').then((m) => m.routes)
      },
      {
        path: 'parceiros',
        loadChildren: () => import('./views/parceiros/routes').then((m) => m.routes)
      },
      {
        path: 'compras',
        loadChildren: () => import('./views/compras/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: 'authentication',
    loadChildren: () => import('./views/authentication/routes').then((m) => m.routes)
  },
  {
    path: 'error-pages',
    loadChildren: () => import('./views/error-pages/routes').then((m) => m.routes)
  },
  { path: '**', redirectTo: 'dashboard' }
];
