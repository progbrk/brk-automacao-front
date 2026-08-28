import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Produtos'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./produtos-list/produtos-list.component').then(m => m.ProdutosListComponent),
        data: {
          title: 'Produtos'
        }
      },
      {
        path: 'novo',
        loadComponent: () => import('./produto-detail/produto-detail.component').then(m => m.ProdutoDetailComponent),
        data: {
          title: 'Novo produto'
        }
      },
      {
        path: ':id',
        loadComponent: () => import('./produto-detail/produto-detail.component').then(m => m.ProdutoDetailComponent),
        data: {
          title: 'Editar produto'
        }
      }
    ]
  }
];
