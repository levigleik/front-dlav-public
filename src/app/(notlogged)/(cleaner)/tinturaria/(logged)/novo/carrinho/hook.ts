import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { CartProps } from '@/app/(logged)/rol/cart/types'

export const useCartTinturaria = create<CartProps>()(
  devtools(
    persist(
      (set, get) => ({
        setCart: (cart) => set({ cart }),
        setTempCart: (tempCart) => set({ tempCart }),
        setTotal: (total) => {
          const cart = get().cart
          if (!cart) return
          const newCart = { ...cart, total }
          set({ cart: newCart })
        },
        setQuantity: (id, quantity) => {
          const cart = get().cart
          if (!cart || !cart.products) return
          const newCart = {
            ...cart,
            products: cart.products.map((item) =>
              item.id === id ? { ...item, quantity } : item,
            ),
          }
          set({ cart: newCart })
        },
        addProduct: (product) => {
          const cart = get().cart
          if (cart && cart.products) {
            const newCart = {
              ...cart,
              products: [...cart.products, product],
            }
            set({ cart: newCart })
          } else {
            const newCart = {
              ...cart,
              products: [product],
            }
            set({ cart: newCart })
          }
        },
        addClient: (client) => {
          const cart = get().cart
          if (cart) {
            const newCart = { ...cart, client }
            set({ cart: newCart })
          } else {
            const newCart = { client }
            set({ cart: newCart })
          }
        },
        removeProduct: (nanoid) => {
          const cart = get().cart
          if (!cart || !cart.products) return
          const newCart = {
            ...cart,
            products: cart.products.filter((item) => item.nanoid !== nanoid),
          }
          set({ cart: newCart })
        },
        setProductTemp: (product) => {
          set({ productTemp: product })
        },
        setIsViewOnly: (isViewOnly) => set({ isViewOnly }),
        clearCart: () => {
          set({ cart: undefined, productTemp: undefined, isViewOnly: false })
        },
      }),
      {
        name: 'cart-tinturaria-state',
      },
    ),
  ),
)
