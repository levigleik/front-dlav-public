import { DefectProps } from '@/types/defect'
import { ColumnProps } from 'components/table/types'

export const columnsDefects: ColumnProps<DefectProps<any>>[] = [
  {
    uid: 'name',
    label: 'Nome',
    sortable: true,
    filterable: true,
  },
]
