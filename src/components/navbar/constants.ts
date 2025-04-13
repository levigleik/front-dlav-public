import { routesFront } from '@/utils/constants'

const getPermissionByPathRoute = (path: string) => {
  const sortedRoutes = routesFront.sort((a, b) => b.path.length - a.path.length)

  const route = sortedRoutes.find((route) => path.startsWith(route.path))
  console.log(route?.path === '/monitoring', route?.permissions)
  return route?.permissions ?? []
}

export const menuItems = [
  {
    name: 'Home',
    path: '/',
    icon: 'home',
    dropdown: null,
    permissions: getPermissionByPathRoute('/'),
  },
  {
    name: 'Rol',
    path: '/rol',
    icon: 'rol',
    dropdown: null,
    permissions: getPermissionByPathRoute('/rol'),
  },
  {
    name: 'Acompanhamento',
    dropdown: [
      {
        name: 'Rols',
        path: '/monitoring/rols',
        icon: 'rol',
        permissions: getPermissionByPathRoute('/monitoring'),
      },
      {
        name: 'Produtos',
        path: '/monitoring/products',
        icon: 'product',
        permissions: getPermissionByPathRoute('/monitoring'),
      },
    ],
    path: '#monitoring',
    permissions: ['admin', 'manager', 'worker'],
    icon: 'monitoring',
  },
  {
    name: 'Items',
    dropdown: [
      {
        name: 'Produtos',
        path: '/product',
        icon: 'product',
        dropdown: null,
        permissions: getPermissionByPathRoute('/product'),
      },
      {
        name: 'Grupos',
        path: '/group',
        icon: 'group',
        dropdown: null,
        permissions: getPermissionByPathRoute('/group'),
      },
      {
        name: 'Tabela de preços',
        path: '/priceList',
        icon: 'priceList',
        dropdown: null,
        permissions: getPermissionByPathRoute('/priceList'),
      },
      {
        name: 'Defeitos',
        path: '/defect',
        icon: 'defect',
        dropdown: null,
        permissions: getPermissionByPathRoute('/defect'),
      },
    ],
    path: '#items',
    icon: 'items',
    permissions: ['admin', 'manager'],
  },
  {
    name: 'Configurações',
    dropdown: [
      {
        name: 'Usuários',
        path: '/user',
        icon: 'user',
        permissions: getPermissionByPathRoute('/user'),
      },
      {
        name: 'Clientes',
        path: '/client',
        icon: 'client',
        permissions: getPermissionByPathRoute('/client'),
      },
      {
        name: 'Setores',
        path: '/sector',
        icon: 'sector',
        permissions: getPermissionByPathRoute('/sector'),
      },
      {
        name: 'Empregados',
        path: '/employee',
        icon: 'employee',
        permissions: getPermissionByPathRoute('/employee'),
      },
      {
        name: 'Registros',
        path: '/record',
        icon: 'record',
        permissions: getPermissionByPathRoute('/record'),
      },
      {
        name: 'Logs',
        path: '/log',
        icon: 'log',
        permissions: getPermissionByPathRoute('/log'),
      },
      {
        name: 'Controle de limpeza',
        path: '/washControlEmployee',
        icon: 'washControlEmployee',
        permissions: getPermissionByPathRoute('/washControlEmployee'),
      },
    ],
    path: '#settings',
    permissions: ['admin', 'manager'],
    icon: 'settings',
  },
] as const
