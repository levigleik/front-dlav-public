import { ProductProps } from '@/types/product'
import { capitalize } from '@/utils/functions'
import { ColumnProps } from 'components/table/types'

export const columnsProducts: ColumnProps<ProductProps<any>>[] = [
  {
    uid: 'name',
    label: 'Nome',
    sortable: true,
    filterable: true,
  },
  {
    uid: 'description',
    label: 'Descrição',
    filterable: true,
  },
  {
    uid: 'type',
    label: 'Tipo',
    filterable: true,
    renderCell: (row) => capitalize(row.type),
  },
]
