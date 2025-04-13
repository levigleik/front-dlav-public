import { GroupProps } from '@/types/group'
import { PriceListProps } from '@/types/priceList'
import { ProductProps } from '@/types/product'
import {
  ProductFormProps,
  ProductFormSendProps,
} from '../../product/[id]/types'
import { ClientProps } from '@/types/client'

export type PriceListDefaultProps = PriceListProps<
  GroupProps<ProductProps<any>, any>,
  ProductProps<any>,
  any
>

export type PriceListFormProps = Omit<
  PriceListProps<
    Partial<GroupProps<ProductFormProps, any>>,
    Partial<ProductFormProps>,
    any
  >,
  'clientIds'
> & {
  clientIds: string[]
}

export type PriceListFormSendProps = PriceListProps<
  Partial<GroupProps<Partial<ProductFormSendProps>, any>>,
  Partial<ProductFormSendProps>,
  any
> & { clientIds: number[] }

export type PriceListGetProps = PriceListProps<any, any, ClientProps>
