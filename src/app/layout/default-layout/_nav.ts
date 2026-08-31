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
  },
  {
    name: 'Serviços',
    url: '/servicos',
    iconComponent: { name: 'cil-tags' }
  },
  {
    name: 'Planos de assinatura',
    url: '/planos-assinatura',
    iconComponent: { name: 'cil-calendar' }
  },
  {
    name: 'Assinaturas',
    url: '/assinaturas',
    iconComponent: { name: 'cil-credit-card' }
  },
  {
    name: 'Fornecedores',
    url: '/fornecedores',
    iconComponent: { name: 'cil-inbox' }
  },
  {
    name: 'Parceiros',
    url: '/parceiros',
    iconComponent: { name: 'cil-user-follow' }
  },
  {
    name: 'Compras',
    url: '/compras',
    iconComponent: { name: 'cil-spreadsheet' }
  },
  {
    name: 'Comissões',
    url: '/comissoes',
    iconComponent: { name: 'cil-chart-pie' }
  },
  {
    name: 'Pagamentos',
    url: '/pagamentos',
    iconComponent: { name: 'cil-task' }
  }
];
