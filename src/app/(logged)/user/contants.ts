import { UserProps } from '@/types/user'
import { ColumnProps } from 'components/table/types'

export const columnsUsers: ColumnProps<UserProps>[] = [
  {
    uid: 'name',
    label: 'Nome',
    sortable: true,
    filterable: true,
  },
  {
    uid: 'email',
    label: 'Email',
    sortable: true,
    filterable: true,
  },
  {
    uid: 'role',
    label: 'Tipo',
    sortable: true,
    filterable: true,
    renderCell: (row) =>
      row.role === 'admin'
        ? 'Administrador'
        : row.role === 'manager'
          ? 'Gerente'
          : 'Colaborador',
  },
]
