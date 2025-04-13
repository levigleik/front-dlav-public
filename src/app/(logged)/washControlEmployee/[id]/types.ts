import { WashControlEmployeeProps } from '@/types/washControlEmployee'
import { ClientProps } from '@/types/client'
import { ProductDefaultProps } from '@/app/(logged)/product/[id]/types'

export type WashControlEmployeeFormProps = Omit<
  WashControlEmployeeProps<ClientProps, ProductDefaultProps>,
  'productId' | 'employeeId' | 'limit' | 'used' | 'avaliation'
> & {
  productId: string
  employeeId: string
  limit: string
  used: string
  avaliation: string
  clientId: string
}
