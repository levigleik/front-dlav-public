'use client'
import { useEffect } from 'react'
import SignTab from './(tabs)/signTab'
import CartTab from './(tabs)/cartTab'
import { useRolHook } from '@/app/(logged)/rol/new/hook'
import PrintTab from '@/app/(logged)/rol/cart/(tabs)/printTab'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getData } from '@/utils/functions.api'
import { RolProps } from '@/types/rol'
import Loading from 'components/loading'
import SubdivisionTab from '@/app/(logged)/rol/cart/(tabs)/subdivisionTab'
import { nanoid } from 'nanoid'
import { useCart } from '@/app/(logged)/rol/cart/hook'

const RolNew = () => {
  const { tab, setTab } = useRolHook()
  const { setCart, cart, tempCart } = useCart()

  const id = useSearchParams().get('id')
  const products = useSearchParams().get('products')
  const { data, isLoading, isError } = useQuery({
    queryFn: ({ signal }) =>
      getData<RolProps>({
        url: 'rol/find-first',
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
      {((id && !isError) || !id) && (
        <>
          {tab === '1' && <CartTab />}
          {tab === '2' && <SignTab />}
          {tab === '3' && <PrintTab />}
          {tab === '4' && <SubdivisionTab />}
        </>
      )}
    </div>
  )
}

export default RolNew
