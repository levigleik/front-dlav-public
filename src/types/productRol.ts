import { ProductProps } from '@/types/product'
import { ProductStatusProps } from '@/types/productStatus'

export interface ProductRolProps<Rol> extends ProductProps<any> {
  hairHeight: string
  background: string
  edge: string
  stamp: string
  color: string
  quantity: number
  status?: ProductStatusProps<any>
  rol?: Rol
  rolId: number
  productStatusId: number
  priceListId?: number
  nanoid?: string
  finalPrice?: number
  employeeOwner?: {
    employeeId: number
    productId: number
  }
  urgency?: boolean
  urgencyDate?: string
}
