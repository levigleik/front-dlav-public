'use client'
import { useEffect } from 'react'
import CartTab from './(tabs)/cartTab'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getData } from '@/utils/functions.api'
import { RolProps } from '@/types/rol'
import Loading from 'components/loading'
import { nanoid } from 'nanoid'
import { useCartTinturaria } from '@/app/(notlogged)/(cleaner)/tinturaria/(logged)/novo/carrinho/hook'
import { useRolTinturiaHook } from '@/app/(notlogged)/(cleaner)/tinturaria/(logged)/novo/(new)/hook'

const RolTinturariaNew = () => {
  const { tab, setTab } = useRolTinturiaHook()
  const { setCart, cart, tempCart } = useCartTinturaria()

  const id = useSearchParams().get('id')
  const products = useSearchParams().get('products')
  const { data, isLoading, isError } = useQuery({
    queryFn: ({ signal }) =>
      getData<RolProps>({
        url: 'rol/web/find-first',
        signal,
        query:
          'include.rolSigningUser.include.user=true' +
          '&&include.products=true&&include.client.include.address=true' +
          `${id ? `&&where.id=${id}` : ''}`,
      }),
    queryKey: ['rol-get', id],
    enabled: !!id,
  })

  useEffect(() => {
    if (id) {
      if (data) {
        setCart({
          ...data,
          products: data.products.map((product) => ({
            ...product,
            nanoid: nanoid(),
          })),
        })
      }
      if (isError) throw new Error('Erro ao buscar Rol')
    }
    if (products) {
      setTab('4')
    }
  }, [data, id, isError, products, setCart, setTab])

  useEffect(() => {
    return () => {
      if (cart?.id && !id && !tempCart) setCart(undefined)
    }
  }, [cart?.id, id, setCart, tempCart])

  return (
    <div>
      {isLoading && <Loading />}
      {((id && !isError) || !id) && <>{tab === '1' && <CartTab />}</>}
    </div>
  )
}

export default RolTinturariaNew
