import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Assinaturas'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./assinaturas-list/assinaturas-list.component').then(m => m.AssinaturasListComponent),
        data: {
          title: 'Assinaturas'
        }
      },
      {
        path: 'novo',
        loadComponent: () => import('./assinatura-detail/assinatura-detail.component').then(m => m.AssinaturaDetailComponent),
        data: {
          title: 'Nova assinatura'
        }
      },
      {
        path: ':id',
        loadComponent: () => import('./assinatura-detail/assinatura-detail.component').then(m => m.AssinaturaDetailComponent),
        data: {
          title: 'Editar assinatura'
        }
      }
    ]
  }
];
