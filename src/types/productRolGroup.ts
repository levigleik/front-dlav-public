import { ProductStatusProps } from '@/types/productStatus'
import { ProductRolProps } from '@/types/productRol'
import { RolProps } from '@/types/rol'
import { DefaultProps } from '@/types/index'

export interface ProductRolGroupProps extends DefaultProps {
  name: string
  products: ProductRolProps<any>[]
  status?: ProductStatusProps<any>
  productStatusId: number
  rolId: number
  rol?: RolProps
}
