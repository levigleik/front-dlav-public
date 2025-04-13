import { SectorProps } from '@/types/sector'
import { ColumnProps } from 'components/table/types'

export const columnsSectors: ColumnProps<SectorProps<any>>[] = [
  {
    uid: 'name',
    label: 'Nome',
    sortable: true,
    filterable: true,
  },
]
