import { DefaultProps } from '@/types/index'
import { EmployeeProps } from '@/types/employee'
import { ClientProps } from '@/types/client'
import { ProductProps } from '@/types/product'
import { GroupProps } from '@/types/group'

export interface WashControlEmployeeProps<Client, Product>
  extends DefaultProps {
  active: boolean
  limit: number
  used: number
  avaliation: number
  employeeId: number
  employee?: EmployeeProps<Client>
  productId: number
  product?: ProductProps<Product>
}
