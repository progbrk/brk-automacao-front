import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Pagamentos'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./pagamentos-list/pagamentos-list.component').then(m => m.PagamentosListComponent),
        data: {
          title: 'Pagamentos'
        }
      },
      {
        path: 'novo',
        loadComponent: () => import('./pagamento-detail/pagamento-detail.component').then(m => m.PagamentoDetailComponent),
        data: {
          title: 'Novo pagamento'
        }
      },
      {
        path: ':id',
        loadComponent: () => import('./pagamento-detail/pagamento-detail.component').then(m => m.PagamentoDetailComponent),
        data: {
          title: 'Editar pagamento'
        }
      }
    ]
  }
];
