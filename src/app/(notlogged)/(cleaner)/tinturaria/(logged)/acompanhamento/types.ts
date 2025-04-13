import { MonitoringHook } from '@/app/(logged)/monitoring/rols/types'

export type CleanerMonitoringProps = Omit<
  MonitoringHook,
  'orderBy' | 'setOrderBy'
> & {
  dateStart: string
  setDateStart: (date: string) => void
  dateEnd: string
  setDateEnd: (date: string) => void
  orderBy?: 'name'
  setOrderBy: (orderBy: 'name') => void
}
