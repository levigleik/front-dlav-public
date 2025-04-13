import { create } from 'zustand'
import { RecordHook } from '@/app/(logged)/record/types'
import { endOfDay, startOfDay, subDays } from 'date-fns'

export const useLogHook = create<RecordHook>((set) => ({
  isFilterOpen: false,
  dateStart: subDays(startOfDay(new Date()), 7).toISOString(),
  dateEnd: endOfDay(new Date()).toISOString(),
  setIsFilterOpen: (isFilterOpen) => set({ isFilterOpen }),
  setRols: (rols) => set({ rols }),
  setOrderBy: (orderBy) => set({ orderBy }),
  setIsProductModalOpen: (isProductModalOpen, idProductModalOpen) =>
    set({ isProductModalOpen, idProductModalOpen }),
  setClientIds: (clientIds) => set({ clientIds }),
  setDateStart: (dateStart) => set({ dateStart }),
  setDateEnd: (dateEnd) => set({ dateEnd }),
  clear: () =>
    set({ rols: undefined, orderBy: undefined, clientIds: undefined }),
}))
