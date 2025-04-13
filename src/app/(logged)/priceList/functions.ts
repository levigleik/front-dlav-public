import { ProductProps } from '@/types/product'
import { PriceListDefaultProps } from '@/app/(logged)/priceList/[id]/types'

export const reorderProductsAndGroups = (data: PriceListDefaultProps) => {
  const orderedGroups = data?.groups?.sort((a, b) =>
    a.name.localeCompare(b.name),
  )
  const orderedProducts = orderedGroups?.flatMap(
    (group) => group.products?.sort((a, b) => a.name.localeCompare(b.name)),
  )
  if (!orderedGroups || !orderedProducts) return data
  return {
    ...data,
    groups: orderedGroups?.map((group) => ({
      ...group,
      products: orderedProducts?.filter(
        (product) => product?.group?.id === group.id,
      ) as ProductProps<any>[],
    })),
  }
}
