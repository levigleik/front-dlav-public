import { RecursivePartial } from '@/types'
import { RolProps } from '@/types/rol'
import { ProductRolProps } from '@/types/productRol'
import { ClientProps } from '@/types/client'

export type CartProps = {
  cart?: RecursivePartial<RolProps>
  setCart: (cart?: RolProps) => void
  tempCart?: RecursivePartial<RolProps>
  setTempCart: (cart?: RolProps) => void
  setTotal: (total: number) => void
  setQuantity: (id: number, quantity: number) => void
  addProduct: (product: RecursivePartial<ProductRolProps<any>>) => void
  setProductTemp: (product?: ProductRolProps<any>) => void
  productTemp?: ProductRolProps<any>
  addClient: (client: ClientProps) => void
  isViewOnly?: boolean
  setIsViewOnly: (isViewOnly: boolean) => void
  removeProduct: (nanoid: string) => void
  clearCart: () => void
}
