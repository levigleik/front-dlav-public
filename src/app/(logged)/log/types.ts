import {
  FilterMonitoringProps,
  MonitoringHook,
} from '@/app/(logged)/monitoring/rols/types'

export type LogHook = Omit<MonitoringHook, 'orderBy' | 'setOrderBy'> & {
  dateStart: string
  setDateStart: (date: string) => void
  dateEnd: string
  setDateEnd: (date: string) => void
  orderBy?: 'date'
  setOrderBy: (orderBy: 'date') => void
}

export type FilterRecordProps = FilterMonitoringProps & {
  dateStart?: Date
  dateEnd?: Date
}
