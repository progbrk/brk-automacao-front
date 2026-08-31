import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Planos de assinatura'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./planos-list/planos-list.component').then(m => m.PlanosListComponent),
        data: {
          title: 'Planos de assinatura'
        }
      },
      {
        path: 'novo',
        loadComponent: () => import('./plano-detail/plano-detail.component').then(m => m.PlanoDetailComponent),
        data: {
          title: 'Novo plano'
        }
      },
      {
        path: ':id',
        loadComponent: () => import('./plano-detail/plano-detail.component').then(m => m.PlanoDetailComponent),
        data: {
          title: 'Editar plano'
        }
      }
    ]
  }
];
