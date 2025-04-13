'use client'
import { useEffect } from 'react'
import ClientTab from './(tabs)/clientTab'
import PriceListTab from './(tabs)/priceListTab'
import { useRolHook } from './hook'
import GroupTab from './(tabs)/groupTab'
import ProductTab from '@/app/(logged)/rol/new/(tabs)/productTab'
import DetailsTab from '@/app/(logged)/rol/new/(tabs)/details'
import { Badge, Button } from '@nextui-org/react'
import { FaExclamationTriangle, FaShoppingCart } from 'react-icons/fa'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useCart } from '@/app/(logged)/rol/cart/hook'
import WashControlEmployeeTab from '@/app/(logged)/rol/new/(tabs)/washControlEmployeeTab'
import WashControlProductTab from '@/app/(logged)/rol/new/(tabs)/washControlProductTab'

const RolNew = () => {
  const {
    tab,
    clear,
    setLocation,
    location,
    setTab,
    setPriceListId,
    editClient,
    setClientId,
  } = useRolHook()
  const { cart, productTemp: product, setProductTemp: setProduct } = useCart()

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
      {tab === '1' && <ClientTab />}
      {tab === '2' && <PriceListTab />}
      {tab === '3' && <GroupTab />}
      {tab === '4' && <ProductTab groupStyle="list" />}
      {tab === '5' && <DetailsTab />}
      {tab === '6' && <WashControlEmployeeTab />}
      {tab === '7' && <WashControlProductTab />}
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
              href={'/rol/cart'}
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
