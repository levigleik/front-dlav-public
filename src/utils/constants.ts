import { UserProps } from '@/types/user'
import { QueryClientConfig } from '@tanstack/react-query'

export const userErrors = {
  'user-not-found': 'Não há nenhum usuário com esse login.',
  'invalid-password': 'Senha incorreta, por favor verifique sua senha.',
  'disabled-user': 'Usuário desativado.',
  'session-revoked': 'O token da sua sessão foi revogado.',
  'token-already-used': 'O token já foi utilizado.',
  'invalid-oldPassword': 'A senha atual não está correta.',
  Unauthorized: 'Não autorizado.',
}

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      // suspense: true,
      retry: 1,
      staleTime: 5 * 1000,
      networkMode: 'offlineFirst',
      // throwOnError: true,
    },
    mutations: {
      // suspense: true,
      // throwOnError: true,
      networkMode: 'offlineFirst',
    },
  },
} as QueryClientConfig

export const roleOptions = [
  { label: 'Gerente', value: 'manager' },
  { label: 'Colaborador', value: 'worker' },
]

export const routesFront: {
  path: string
  permissions: UserProps['role'][]
  private: boolean
}[] = [
  // private routes
  {
    path: '/',
    permissions: ['admin', 'manager', 'worker'],
    private: true,
  },
  {
    path: '/user',
    permissions: ['admin', 'manager'],
    private: true,
  },
  {
    path: '/client',
    permissions: ['admin', 'manager'],
    private: true,
  },
  {
    path: '/rol',
    permissions: ['admin', 'manager', 'worker'],
    private: true,
  },
  {
    path: '/priceList',
    permissions: ['admin', 'manager'],
    private: true,
  },
  {
    path: '/defect',
    permissions: ['admin', 'manager', 'worker'],
    private: true,
  },
  {
    path: '/worker',
    permissions: ['worker'],
    private: true,
  },
  {
    path: '/monitoring',
    permissions: ['admin', 'manager', 'worker'],
    private: true,
  },
  {
    path: '/employee',
    permissions: ['admin', 'manager'],
    private: true,
  },
  {
    path: '/sector',
    permissions: ['admin', 'manager'],
    private: true,
  },
  {
    path: '/sector-select',
    permissions: ['manager', 'worker'],
    private: true,
  },
  {
    path: '/product',
    permissions: ['admin', 'manager'],
    private: true,
  },
  {
    path: '/group',
    permissions: ['admin', 'manager'],
    private: true,
  },
  {
    path: '/priceList',
    permissions: ['admin', 'manager'],
    private: true,
  },
  {
    path: '/record',
    permissions: ['admin', 'manager'],
    private: true,
  },

  {
    path: '/log',
    permissions: ['admin', 'manager'],
    private: true,
  },

  {
    path: '/washControlEmployee',
    permissions: ['admin', 'manager'],
    private: true,
  },

  // public routes
  {
    path: '/login',
    permissions: [],
    private: false,
  },
  {
    path: '/tinturaria',
    permissions: [],
    private: false,
  },
  {
    path: '/reset-password',
    permissions: [],
    private: false,
  },
  {
    path: '/change-password',
    permissions: [],
    private: false,
  },
  {
    path: '/version',
    permissions: [],
    private: false,
  },
]

export const cookiesSettings = {
  // expires in 1 week
  expires: 7,
  // secure: true,
}

export const frontUrl = 'https://dlav.vercel.app'

export const DLAV_COMPANY = {
  name: 'Dlav',
  cnpj: '06247750000149',
  address: { publicArea: 'Av Crisanto Arruda, 101', neighborhood: 'Passare' },
  phone: '(85) 3295-3138',
}
