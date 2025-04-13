import { DefaultProps } from '@/types/index'

export interface SectorProps<Users> extends DefaultProps {
  name: string
  users: Users[]
}
