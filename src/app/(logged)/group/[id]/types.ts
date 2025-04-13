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

export type GroupDefaultProps = GroupProps<ProductProps<any>, any>

export type GroupFormProps = Omit<GroupProps<any, any>, 'priceListId'> & {
  products: Omit<
    ProductProps<any>,
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
  }
  priceListId: string
}

export type GroupFormSendProps = Omit<GroupDefaultProps, 'products'> & {
  products: Partial<
    Omit<
      ProductProps<any>,
      'defects' | 'hairHeights' | 'backgrounds' | 'edges' | 'stamps' | 'colors'
    > & {
      defects?: Partial<DefectProps<any>>[]
      hairHeights?: Partial<HairHeightProps>[]
      backgrounds?: Partial<BackgroundProps>[]
      edges?: Partial<EdgeProps>[]
      stamps?: Partial<StampProps>[]
      colors?: Partial<ColorProps>[]
    }
  >[]
}
