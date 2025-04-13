export type FlattenIfArray<T> = T extends (infer R)[] ? R : T
export type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P & string}`
    : never
  : never

type Prev<T extends number, D extends [...any[]]> = ((
  ...x: [...D, ...any[]]
) => typeof x) extends (...x: infer L) => any
  ? L['length']
  : never

export type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends string | number
          ? `${K}` | Join<K, Paths<FlattenIfArray<T[K]>, Prev<any, any>>>
          : never
      }[keyof T]
    : ''

export type ColumnProps<TData extends Record<string, any>> = {
  uid: keyof TData | 'actions' | 'expand'
  label: string
  renderCell?: (item: TData) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
}

export type TableProps<TData extends Record<string, any>> = {
  data?: TData[]
  columns: ColumnProps<TData>[]
  showColumnsFilter?: boolean
  rowsPagination?: number[]
  loading?: boolean
}
//  & {
//   expandable?: boolean
//   renderExpand?: (item: TData) => React.ReactNode
// }

export type TableHook = {
  expandedColumns: number[]
  setExpandedColumns: (columns: number[]) => void
}
