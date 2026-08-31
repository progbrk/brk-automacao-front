import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Compras'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./compras-list/compras-list.component').then(m => m.ComprasListComponent),
        data: {
          title: 'Compras'
        }
      },
      {
        path: 'novo',
        loadComponent: () => import('./compra-detail/compra-detail.component').then(m => m.CompraDetailComponent),
        data: {
          title: 'Nova compra'
        }
      },
      {
        path: ':id',
        loadComponent: () => import('./compra-detail/compra-detail.component').then(m => m.CompraDetailComponent),
        data: {
          title: 'Editar compra'
        }
      }
    ]
  }
];
