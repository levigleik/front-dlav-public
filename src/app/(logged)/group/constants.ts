import { GroupProps } from '@/types/group'
import { PriceListProps } from '@/types/priceList'
import { ColumnProps } from 'components/table/types'

export const columnsGroups: ColumnProps<
  GroupProps<any, PriceListProps<any, any, any>>
>[] = [
  {
    uid: 'name',
    label: 'Nome',
    sortable: true,
    filterable: true,
  },
  {
    uid: 'priceList',
    label: 'Descrição',
    filterable: true,
    renderCell: (row) => row.priceList?.name,
  },
]
