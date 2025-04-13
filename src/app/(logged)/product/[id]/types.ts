import { DefectProps } from '@/types/defect'
import { GroupProps } from '@/types/group'
import {
  BackgroundProps,
  ColorProps,
  EdgeProps,
  HairHeightProps,
  ProductProps,
  StampProps,
} from '@/types/product'

export type ProductDefaultProps = ProductProps<GroupProps<any, any>>

export type ProductFormProps = Omit<
  ProductProps<GroupProps<any, any>>,
  | 'height'
  | 'width'
  | 'diameter'
  | 'quantity'
  | 'price'
  | 'hairHeights'
  | 'backgrounds'
  | 'edges'
  | 'stamps'
  | 'defects'
  | 'colors'
> & {
  height: string
  width: string
  diameter: string
  quantity: string
  price: string
  hairHeights: string[]
  stamps: string[]
  backgrounds: string[]
  edges: string[]
  defects: string[]
  colors: string[]
  urgency: boolean
  urgencyDate: Date
  employee: boolean
  employeeOwner?: {
    employeeId: number
    productId: number
  }
}

export type ProductFormSendProps = Omit<
  ProductDefaultProps,
  'defects' | 'hairHeights' | 'backgrounds' | 'edges' | 'stamps' | 'colors'
> & {
  defects?: Partial<DefectProps<any>>[]
  hairHeights?: Partial<HairHeightProps>[]
  backgrounds?: Partial<BackgroundProps>[]
  edges?: Partial<EdgeProps>[]
  stamps?: Partial<StampProps>[]
  colors?: Partial<ColorProps>[]
}
