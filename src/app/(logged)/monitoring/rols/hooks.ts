import { create } from 'zustand'
import { MonitoringHook } from '@/app/(logged)/monitoring/rols/types'

export const useMonitoringRolHook = create<MonitoringHook>((set) => ({
  isFilterOpen: false,
  setIsFilterOpen: (isFilterOpen) => set({ isFilterOpen }),
  setRols: (rols) => set({ rols }),
  setOrderBy: (orderBy) => set({ orderBy }),
  setIsProductModalOpen: (isProductModalOpen, idProductModalOpen) =>
    set({ isProductModalOpen, idProductModalOpen }),
  setClientIds: (clientIds) => set({ clientIds }),
  clear: () =>
    set({ rols: undefined, orderBy: undefined, clientIds: undefined }),
}))
