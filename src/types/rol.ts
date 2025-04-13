import { DefaultProps } from '.'
import { ClientProps } from './client'
import { ProductRolProps } from '@/types/productRol'
import { UserProps } from '@/types/user'
import { ProductRolGroupProps } from '@/types/productRolGroup'

export type LocationProps = {
  latitude: string
  longitude: string
}

export type StatusRolProps = 'inProgress' | 'finished' | 'paused' | 'canceled'

export interface RolSigningUserProps<Rol> extends DefaultProps {
  userId: number
  user?: UserProps
  rols?: Rol[]
}
export interface RolFinshingUserProps<Rol> extends DefaultProps {
  userId: number
  user?: UserProps
  rols?: Rol[]
}

export interface RolProps extends DefaultProps {
  os?: string
  total?: number
  observation?: string
  launchSignature: string
  startSubscriberName?: string
  startSubscriberPhone?: string
  startLocation: LocationProps
  status: StatusRolProps
  products: ProductRolProps<any>[]
  client?: ClientProps
  clientId: number
  rolSigningUserId: number
  rolSigningUser?: RolSigningUserProps<any>
  rolFinishingUserId?: number
  rolFinishingUser?: RolFinshingUserProps<any>
  productGroups?: ProductRolGroupProps[]
}

export interface RolFinishProps
  extends Omit<RolProps, 'launchSignature' | 'startLocation'> {
  finalSignature: string
  finishLocation: LocationProps
  finalSubscriberName?: string
  finalSubscriberPhone?: string
}
