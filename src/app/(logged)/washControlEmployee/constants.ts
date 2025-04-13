import { WashControlEmployeeProps } from '@/types/washControlEmployee'
import { ClientProps } from '@/types/client'
import { ProductDefaultProps } from '@/app/(logged)/product/[id]/types'
import { ColumnProps } from 'components/table/types'

export const columnsWashControl: ColumnProps<
  WashControlEmployeeProps<ClientProps, ProductDefaultProps>
>[] = [
  {
    uid: 'employee.name' as any,
    label: 'Empregado',
    sortable: true,
    filterable: true,
    renderCell: (item) => {
      return item.employee?.name || ''
    },
  },
  {
    uid: 'product.name' as any,
    label: 'Produto',
    filterable: true,
    renderCell: (item) => {
      return item.product?.name || ''
    },
  },
]
