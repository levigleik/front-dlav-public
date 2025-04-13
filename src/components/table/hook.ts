import { create } from 'zustand'
import { TableHook } from './types'

export const useTableHook = create<TableHook>((set) => ({
  expandedColumns: [],
  setExpandedColumns: (columns) => set({ expandedColumns: columns }),
}))
