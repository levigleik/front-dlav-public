import { ProductRolProps } from '@/types/productRol'
import { ProductProps } from '@/types/product'

export const calculatePrice = (item: ProductRolProps<any>) => {
  if (item.type === 'tapete' && !item.id) {
    return item.finalPrice ?? 0
  }
  return item.price ?? 0
}

export const calculateAdditionalCosts = (item: ProductRolProps<any>) => {
  return item.additionals?.reduce((a, b) => (a ?? 0) + (b?.price ?? 0), 0) ?? 0
}

export const calculateTotalItemPrice = (item: ProductRolProps<any>) => {
  const price = calculatePrice(item)
  const additionalCosts = calculateAdditionalCosts(item)
  const quantity = item.quantity ?? 0
  return price * quantity + additionalCosts * quantity
}

export function areProductsEqual(
  products1: ProductProps<any>[],
  products2: ProductProps<any>[],
): boolean {
  if (products1.length !== products2.length) {
    return false
  }

  for (let i = 0; i < products1.length; i++) {
    const product1 = products1[i]
    const product2 = products2[i]

    // Compare todas as propriedades do produto aqui
    // Se alguma propriedade não for igual, retorne false
    for (let key in product1) {
      if (
        product1[key as keyof ProductProps<any>] !==
        product2[key as keyof ProductProps<any>]
      ) {
        return false
      }
    }
  }

  return true
}
