import { RolProps } from '@/types/rol'
import { ColumnProps } from 'components/table/types'

export const columnsRols: ColumnProps<RolProps>[] = [
  {
    uid: 'id',
    label: 'ID',
    sortable: true,
    filterable: true,
  },
  {
    uid: 'client',
    label: 'Cliente',
    sortable: true,
    filterable: true,
    renderCell: (row: RolProps) => row.client?.fantasyName,
  },
  {
    uid: 'status',
    label: 'Status',
    sortable: true,
    filterable: true,
    renderCell: (row: RolProps) => {
      let status = 'Em andamento'
      if (row.status === 'finished') {
        status = 'Finalizado'
      } else if (row.status === 'paused') {
        status = 'Pausado'
      } else if (row.status === 'canceled') {
        status = 'Cancelado'
      }
      return status
    },
  },
  {
    uid: 'rolSigningUser',
    label: 'Usuário',
    sortable: true,
    filterable: true,
    renderCell: (row: RolProps) =>
      row.rolSigningUser?.user?.name ?? 'Sem usuário',
  },
]
