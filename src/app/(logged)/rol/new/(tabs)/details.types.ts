import { AdditionalProps } from '@/types/product'
import { ProductFormProps } from '@/app/(logged)/product/[id]/types'

export type ProductDetailsProps = Omit<ProductFormProps, 'additionals'> & {
  additionals: (Omit<AdditionalProps, 'price'> & { price: string })[]
}
