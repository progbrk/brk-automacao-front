import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Clientes'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./clientes-list/clientes-list.component').then(m => m.ClientesListComponent),
        data: {
          title: 'Clientes'
        }
      },
      {
        path: 'novo',
        loadComponent: () => import('./cliente-detail/cliente-detail.component').then(m => m.ClienteDetailComponent),
        data: {
          title: 'Novo cliente'
        }
      },
      {
        path: ':id',
        loadComponent: () => import('./cliente-detail/cliente-detail.component').then(m => m.ClienteDetailComponent),
        data: {
          title: 'Editar cliente'
        }
      }
    ]
  }
];
