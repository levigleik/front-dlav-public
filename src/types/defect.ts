import { DefaultProps } from '@/types/index'

export interface DefectProps<Product> extends DefaultProps {
  name: string
  description: string
  product?: Product
  productId: number
}
