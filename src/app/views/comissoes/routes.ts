import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Comissões'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./comissoes-list/comissoes-list.component').then(m => m.ComissoesListComponent),
        data: {
          title: 'Comissões'
        }
      },
      {
        path: 'novo',
        loadComponent: () => import('./comissao-detail/comissao-detail.component').then(m => m.ComissaoDetailComponent),
        data: {
          title: 'Nova comissão'
        }
      },
      {
        path: ':id',
        loadComponent: () => import('./comissao-detail/comissao-detail.component').then(m => m.ComissaoDetailComponent),
        data: {
          title: 'Editar comissão'
        }
      }
    ]
  }
];
