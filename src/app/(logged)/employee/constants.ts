import { EmployeeProps } from '@/types/employee'
import { ClientProps } from '@/types/client'
import { ColumnProps } from 'components/table/types'

export const columnsEmployee: ColumnProps<EmployeeProps<ClientProps>>[] = [
  {
    uid: 'name',
    label: 'Nome',
    sortable: true,
    filterable: true,
  },
  {
    uid: 'matriculation',
    label: 'Matrícula',
    filterable: true,
  },
  {
    uid: 'armario',
    label: 'Armário',
    filterable: true,
  },
  {
    uid: 'gaveta',
    label: 'Gaveta',
    filterable: true,
  },
  {
    uid: 'client',
    label: 'Empresa',
    filterable: true,
    renderCell: (item) => {
      return item.client?.fantasyName ?? item.client?.corporateName ?? ''
    },
  },
]
