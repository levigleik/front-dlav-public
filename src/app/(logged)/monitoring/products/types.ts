import { RolProps } from '@/types/rol'

export type MonitoringHook = {
  clientIds?: string[]
  setClientIds: (clientIds: string[]) => void
  rols?: RolProps[]
  setRols: (rol: RolProps[]) => void
  orderBy?: 'name' | 'status' | 'client'
  setOrderBy: (orderBy: 'name' | 'status' | 'client') => void
  isFilterOpen: boolean
  setIsFilterOpen: (isOpen: boolean) => void
  isProductModalOpen?: boolean
  idProductModalOpen?: number
  setIsProductModalOpen: (isOpen: boolean, id?: number) => void
  clear: () => void
}

export type FilterMonitoringProps = {
  rolIds?: string[]
  clientIds?: string[]
}

export type ProductStatusModalFormProps = {
  statusId?: string
}
