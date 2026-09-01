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
    name: 'Vendas',
    url: '/vendas',
    iconComponent: { name: 'cil-dollar' }
  },
  {
    name: 'Pagamentos',
    url: '/pagamentos',
    iconComponent: { name: 'cil-task' }
  },
  {
    name: 'Catálogo & Assinaturas',
    // url interno só pra evitar que o grupo abra sozinho ao carregar (o
    // cabeçalho do grupo nunca navega, só expande/colapsa no clique).
    url: '/grupo/catalogo-assinaturas',
    iconComponent: { name: 'cil-basket' },
    children: [
      {
        name: 'Produtos',
        url: '/produtos',
        iconComponent: { name: 'cil-basket' }
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
      }
    ]
  },
  {
    name: 'Fornecedores',
    url: '/grupo/fornecedores',
    iconComponent: { name: 'cil-inbox' },
    children: [
      {
        name: 'Fornecedores',
        url: '/fornecedores',
        iconComponent: { name: 'cil-inbox' }
      },
      {
        name: 'Compras',
        url: '/compras',
        iconComponent: { name: 'cil-spreadsheet' }
      }
    ]
  },
  {
    name: 'Parceiros',
    url: '/grupo/parceiros',
    iconComponent: { name: 'cil-user-follow' },
    children: [
      {
        name: 'Parceiros',
        url: '/parceiros',
        iconComponent: { name: 'cil-user-follow' }
      },
      {
        name: 'Comissões',
        url: '/comissoes',
        iconComponent: { name: 'cil-chart-pie' }
      }
    ]
  },
  {
    name: 'Equipe',
    url: '/grupo/equipe',
    iconComponent: { name: 'cil-user' },
    children: [
      {
        name: 'Colaboradores',
        url: '/colaboradores',
        iconComponent: { name: 'cil-user' }
      },
      {
        name: 'Pagamentos a colaboradores',
        url: '/pagamentos-colaboradores',
        iconComponent: { name: 'cil-layers' }
      }
    ]
  }
];
