import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Vendas'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./vendas-list/vendas-list.component').then(m => m.VendasListComponent),
        data: {
          title: 'Vendas'
        }
      },
      {
        path: 'novo',
        loadComponent: () => import('./venda-detail/venda-detail.component').then(m => m.VendaDetailComponent),
        data: {
          title: 'Nova venda'
        }
      },
      {
        path: ':id',
        loadComponent: () => import('./venda-detail/venda-detail.component').then(m => m.VendaDetailComponent),
        data: {
          title: 'Editar venda'
        }
      }
    ]
  }
];
