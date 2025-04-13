import { GroupProps } from '@/types/group'
import { DefaultProps } from '@/types/index'
import { TypeSystemProps } from '@/types/client'

export interface PriceListProps<Group, Products, Client> extends DefaultProps {
  name: string
  validity: string
  groups?: GroupProps<Products, any>[] | Group[]
  client?: Client
  clientId: number
  type?: TypeSystemProps
}
