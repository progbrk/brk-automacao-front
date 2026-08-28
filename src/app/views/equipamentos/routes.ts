import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Equipamentos'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./equipamentos-list/equipamentos-list.component').then(m => m.EquipamentosListComponent),
        data: {
          title: 'Equipamentos'
        }
      },
      {
        path: 'novo',
        loadComponent: () => import('./equipamento-detail/equipamento-detail.component').then(m => m.EquipamentoDetailComponent),
        data: {
          title: 'Novo equipamento'
        }
      },
      {
        path: ':id',
        loadComponent: () => import('./equipamento-detail/equipamento-detail.component').then(m => m.EquipamentoDetailComponent),
        data: {
          title: 'Editar equipamento'
        }
      }
    ]
  }
];
