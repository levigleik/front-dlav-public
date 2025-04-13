import { TableSearchProps } from '@/types'
import { create } from 'zustand'

export const useTableSearch = create<TableSearchProps>()((set, get) => ({
  search: '',
  setSearch: (search) => {
    set(() => ({ search }))
  },
  setData: (data) => {
    set(() => ({ data }))
  },
}))
