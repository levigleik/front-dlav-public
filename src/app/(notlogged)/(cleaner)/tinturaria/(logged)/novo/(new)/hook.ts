import { create } from 'zustand'
import { ClientHook } from './types'

export const useRolTinturiaHook = create<ClientHook>((set) => ({
  search: '',
  setSearch: (search: string) => set({ search }),
  location: undefined,
  setLocation: (location) => set({ location }),
  tab: '1',
  // priceListId: 1,
  setGroupId: (groupId) => set({ groupId }),
  setTab: (tab) => set({ tab }),
  setPriceListId: (priceListId) => set({ priceListId }),
  clear: () => {
    set({
      search: '',
      tab: '1',
    })
  },
}))
