import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Pagamentos a colaboradores'
    },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pagamentos-colaboradores-list/pagamentos-colaboradores-list.component').then(
            m => m.PagamentosColaboradoresListComponent
          ),
        data: {
          title: 'Pagamentos a colaboradores'
        }
      },
      {
        path: 'novo',
        loadComponent: () =>
          import('./pagamento-colaborador-detail/pagamento-colaborador-detail.component').then(
            m => m.PagamentoColaboradorDetailComponent
          ),
        data: {
          title: 'Novo pagamento'
        }
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pagamento-colaborador-detail/pagamento-colaborador-detail.component').then(
            m => m.PagamentoColaboradorDetailComponent
          ),
        data: {
          title: 'Editar pagamento'
        }
      }
    ]
  }
];
