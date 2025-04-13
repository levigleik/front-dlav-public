import { routesFront } from '@/utils/constants'

const getPermissionByPathRoute = (path: string) => {
  const sortedRoutes = routesFront.sort((a, b) => b.path.length - a.path.length)

  const route = sortedRoutes.find((route) => path.startsWith(route.path))
  return route?.permissions ?? []
}

export const menuItems = [
  {
    name: 'Registrar',
    path: '/tinturaria/novo',
    icon: 'new',
    dropdown: null,
    permissions: getPermissionByPathRoute('/'),
  },
  {
    name: 'Acompanhamento',
    path: '/tinturaria/acompanhamento',
    icon: 'monitoring',
    dropdown: null,
    permissions: getPermissionByPathRoute('/'),
  },
] as const
