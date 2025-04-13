import { LocationProps } from '@/types/rol'

export type ClientHook = {
  search: string
  setSearch: (search: string) => void
  location?: LocationProps
  setLocation: (location: LocationProps) => void
  tab: string | number
  setTab: (tab: string | number) => void
  groupId?: number
  setGroupId: (groupId: number) => void
  priceListId?: number
  setPriceListId: (priceListId?: number) => void
  clear: (withProduct?: boolean) => void
}
