'use client'

import { Button, Tooltip } from '@nextui-org/react'
import { FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRolHook } from '@/app/(logged)/rol/new/hook'
import { useCart } from '@/app/(logged)/rol/cart/hook'

export default function Header({
  children,
  path,
}: {
  children: React.ReactNode
  path: '/rol' | '/rol/new'
}) {
  const { setTab, editClient, setClientId, isWashControl } = useRolHook()

  const { cart } = useCart()

  const id = useSearchParams().get('id')
  const fromRecord = useSearchParams().get('fromRecord')

  const pathRedirect = fromRecord ? '/record' : path

  const pathName =
    path === '/rol' ? 'Voltar para a lista' : 'Voltar para o lançamento'

  const titleName = id ? 'Conferência' : children
  return (
    <div className="my-8 flex w-full items-center justify-between">
      <h2 className="flex-grow text-3xl font-bold tracking-wide">
        {titleName}
      </h2>
      <Tooltip
        content={fromRecord && pathName ? 'Voltar para o registro' : pathName}
        placement="bottom-end"
        className="text-white"
        color="primary"
      >
        <Button
          color="primary"
          isIconOnly
          as={Link}
          className="rounded-full text-white"
          href={pathRedirect}
          onClick={() => {
            if (!editClient && cart?.client?.id) {
              if (cart?.id && !id) setTab('1')
              else {
                setClientId(cart?.client?.id)
                if (isWashControl) setTab('7')
                else setTab('2')
              }
            }
          }}
        >
          <FaArrowLeft size={20} className="text-white" />
        </Button>
      </Tooltip>
    </div>
  )
}
