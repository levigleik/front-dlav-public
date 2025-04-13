import { PriceListGetProps } from './[id]/types'
import { ColumnProps } from 'components/table/types'

export const columnsPriceLists: ColumnProps<PriceListGetProps>[] = [
  {
    uid: 'name',
    label: 'Nome',
    sortable: true,
    filterable: true,
  },
  {
    uid: 'client',
    label: 'Cliente',
    filterable: true,
    renderCell: (row: PriceListGetProps) => row.client?.fantasyName,
  },
]
