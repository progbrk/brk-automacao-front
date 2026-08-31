import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Fornecedores'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./fornecedores-list/fornecedores-list.component').then(m => m.FornecedoresListComponent),
        data: {
          title: 'Fornecedores'
        }
      },
      {
        path: 'novo',
        loadComponent: () => import('./fornecedor-detail/fornecedor-detail.component').then(m => m.FornecedorDetailComponent),
        data: {
          title: 'Novo fornecedor'
        }
      },
      {
        path: ':id',
        loadComponent: () => import('./fornecedor-detail/fornecedor-detail.component').then(m => m.FornecedorDetailComponent),
        data: {
          title: 'Editar fornecedor'
        }
      }
    ]
  }
];
