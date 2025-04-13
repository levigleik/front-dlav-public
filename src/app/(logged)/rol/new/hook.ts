import { create } from 'zustand'
import { ClientHook } from './types'

export const useRolHook = create<ClientHook>((set) => ({
  search: '',
  setSearch: (search: string) => set({ search }),
  location: undefined,
  editClient: false,
  setLocation: (location) => set({ location }),
  tab: '1',
  setTab: (tab) => set({ tab }),
  setClientId: (clientId) => set({ clientId }),
  setPriceListId: (priceListId) => set({ priceListId }),
  setGroupId: (groupId) => set({ groupId }),
  setEditClient: (editClient) => set({ editClient }),
  setIsWashControl: (isWashControl) => set({ isWashControl }),
  setEmployeeId: (employeeId) => set({ employeeId }),
  clear: () => {
    set({
      search: '',
      tab: '1',
      clientId: undefined,
      priceListId: undefined,
      groupId: undefined,
      editClient: false,
    })
  },
}))
