import { DefaultProps } from '@/types/index'

export interface GroupProps<Products, PriceList> extends DefaultProps {
  name: string
  products?: Products[]
  priceList?: PriceList
  priceListId: number
}
