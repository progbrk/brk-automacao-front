import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Parceiros'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./parceiros-list/parceiros-list.component').then(m => m.ParceirosListComponent),
        data: {
          title: 'Parceiros'
        }
      },
      {
        path: 'novo',
        loadComponent: () => import('./parceiro-detail/parceiro-detail.component').then(m => m.ParceiroDetailComponent),
        data: {
          title: 'Novo parceiro'
        }
      },
      {
        path: ':id',
        loadComponent: () => import('./parceiro-detail/parceiro-detail.component').then(m => m.ParceiroDetailComponent),
        data: {
          title: 'Editar parceiro'
        }
      }
    ]
  }
];
