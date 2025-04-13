import { LocationProps } from '@/types/rol'

export type ClientHook = {
  search: string
  setSearch: (search: string) => void
  location?: LocationProps
  setLocation: (location: LocationProps) => void
  tab: string | number
  setTab: (tab: string | number) => void
  clientId?: number
  setClientId: (clientId?: number) => void
  priceListId?: number
  setPriceListId: (priceListId?: number) => void
  groupId?: number
  setGroupId: (groupId?: number) => void
  editClient?: boolean
  setEditClient: (editClient: boolean) => void
  isWashControl?: boolean
  setIsWashControl: (isWashControl: boolean) => void
  employeeId?: number
  setEmployeeId: (employeeId: number) => void
  clear: (withProduct?: boolean) => void
}
