import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Serviços'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./servicos-list/servicos-list.component').then(m => m.ServicosListComponent),
        data: {
          title: 'Serviços'
        }
      },
      {
        path: 'novo',
        loadComponent: () => import('./servico-detail/servico-detail.component').then(m => m.ServicoDetailComponent),
        data: {
          title: 'Novo serviço'
        }
      },
      {
        path: ':id',
        loadComponent: () => import('./servico-detail/servico-detail.component').then(m => m.ServicoDetailComponent),
        data: {
          title: 'Editar serviço'
        }
      }
    ]
  }
];
