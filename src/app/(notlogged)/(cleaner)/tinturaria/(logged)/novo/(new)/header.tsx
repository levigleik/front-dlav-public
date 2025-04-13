'use client'

import { Button, Tooltip } from '@nextui-org/react'
import { FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCartTinturaria } from '@/app/(notlogged)/(cleaner)/tinturaria/(logged)/novo/carrinho/hook'
import { useRolTinturiaHook } from '@/app/(notlogged)/(cleaner)/tinturaria/(logged)/novo/(new)/hook'

export default function Header({ children }: { children: React.ReactNode }) {
  const { setTab } = useRolTinturiaHook()

  const { cart } = useCartTinturaria()

  const id = useSearchParams().get('id')

  const pathRedirect = '/tinturaria'

  const pathName = 'Voltar'

  const titleName = id ? 'Conferência' : children
  return (
    <div className="my-8 flex w-full items-center justify-between">
      <h2 className="flex-grow text-3xl font-bold tracking-wide">
        {titleName}
      </h2>
      <Tooltip
        content={pathName}
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
            if (cart?.client?.id) {
              if (cart?.id && !id) setTab('1')
            }
          }}
        >
          <FaArrowLeft size={20} className="text-white" />
        </Button>
      </Tooltip>
    </div>
  )
}
