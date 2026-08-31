import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' }
  },
  {
    name: 'Clientes',
    url: '/clientes',
    iconComponent: { name: 'cil-people' }
  },
  {
    name: 'Equipamentos',
    url: '/equipamentos',
    iconComponent: { name: 'cil-settings' }
  },
  {
    name: 'Produtos',
    url: '/produtos',
    iconComponent: { name: 'cil-basket' }
  },
  {
    name: 'Vendas',
    url: '/vendas',
    iconComponent: { name: 'cil-dollar' }
  }
];
