import { ProductProps } from '@/types/product'
import { capitalize } from '@/utils/functions'
import { GroupProps } from '@/types/group'
import { PriceListProps } from '@/types/priceList'
import { ClientProps } from '@/types/client'
import { ColumnProps } from 'components/table/types'

export const columnsProducts: ColumnProps<
  ProductProps<GroupProps<any, PriceListProps<any, any, ClientProps>>>
>[] = [
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
    renderCell: (row) => row.description ?? '-',
  },
  {
    uid: 'group.priceList.client.fantasyName' as any,
    label: 'Cliente',
    filterable: true,
    renderCell: (row) =>
      row.group?.priceList?.client?.fantasyName ??
      row.group?.priceList?.client?.corporateName ??
      '-',
  },
]
