import { SectorProps } from '@/types/sector'

export type SectorForm = SectorProps<any> & {
  userIds: string[]
}

export type SectorFormSend = SectorProps<any> & {
  userIds: number[]
}
