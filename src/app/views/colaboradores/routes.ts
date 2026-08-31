import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Colaboradores'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./colaboradores-list/colaboradores-list.component').then(m => m.ColaboradoresListComponent),
        data: {
          title: 'Colaboradores'
        }
      },
      {
        path: 'novo',
        loadComponent: () => import('./colaborador-detail/colaborador-detail.component').then(m => m.ColaboradorDetailComponent),
        data: {
          title: 'Novo colaborador'
        }
      },
      {
        path: ':id',
        loadComponent: () => import('./colaborador-detail/colaborador-detail.component').then(m => m.ColaboradorDetailComponent),
        data: {
          title: 'Editar colaborador'
        }
      }
    ]
  }
];
