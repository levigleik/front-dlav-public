import { ClientProps } from '@/types/client'
import { ColumnProps } from 'components/table/types'

export const columnsClients: ColumnProps<ClientProps>[] = [
  {
    uid: 'fantasyName',
    label: 'Nome',
    sortable: true,
    filterable: true,
  },
  {
    uid: 'cnpj',
    label: 'CNPJ',
    filterable: true,
  },
  {
    uid: 'address',
    label: 'Endereço',
    filterable: true,
    renderCell: (item) => {
      return item.address?.number
        ? item.address?.publicArea + ', ' + item.address?.number
        : item.address?.publicArea
    },
  },
]
export const firstDeployClients = [
  'centerbox',
  'ASSAI - WASHINGTON SOARES  L027 (245)',
  'b&q',
  'CARREFOUR - MARAPONGA (4)',
  'edp',
  'frangolandia',
  'lav e lev',
  'sao luiz',
  'viana lavanderia',
]
