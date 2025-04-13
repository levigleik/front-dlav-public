'use client'
import { useEffect } from 'react'
import { useRolTinturiaHook } from './hook'
import ProductTab from './(tabs)/productTab'
import DetailsTab from './(tabs)/details'
import { Badge, Button } from '@nextui-org/react'
import { FaExclamationTriangle, FaShoppingCart } from 'react-icons/fa'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useCartTinturaria } from '../carrinho/hook'
import GroupTab from './(tabs)/groupTab'

const RolNew = () => {
  const { tab, clear, setLocation, location, setTab, setPriceListId } =
    useRolTinturiaHook()
  const {
    cart,
    productTemp: product,
    setProductTemp: setProduct,
  } = useCartTinturaria()

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error('Localização não suportada no seu navegador')
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: String(position.coords.latitude),
            longitude: String(position.coords.longitude),
          })
        },
        () => {
          toast.error('Não foi possível obter a localização')
        },
      )
    }
    return () => {
      clear()
      setProduct(undefined)
    }
  }, [setProduct, clear, setLocation])

  useEffect(() => {
    if (cart) {
      if (!cart.id) {
        setPriceListId(cart?.products?.[0]?.group?.priceListId ?? '')
        // if (!product) setTab('3')
      }
      // if (product) {
      //   setTab('5')
      // }
      console.log(cart)
    }
    // if (product) setTab('5')
  }, [product, cart, setPriceListId, setTab])

  return !location ? (
    <div className="flex items-center justify-center text-white">
      <h1 className="flex flex-col items-center justify-center gap-4 rounded-lg bg-danger-200 p-4">
        <FaExclamationTriangle size={32} />
        Sem localização, para continuar, permita o acesso à localização
      </h1>
    </div>
  ) : (
    <div>
      {/*{tab === '1' && <GroupTab />}*/}
      {tab === '1' && <ProductTab groupStyle="list" />}
      {tab === '2' && <DetailsTab />}
      {!!cart?.products?.length && (
        <div className="fixed bottom-4 right-4 ">
          <Badge
            content={cart?.products?.length ?? 0}
            shape={'circle'}
            color="danger"
          >
            <Button
              radius={'full'}
              isIconOnly
              color="primary"
              className="text-white"
              as={Link}
              href={'/tinturaria/novo/carrinho'}
            >
              <FaShoppingCart size={20} className="text-white" />
            </Button>
          </Badge>
        </div>
      )}
    </div>
  )
}

export default RolNew
