'use client'

import { Button, Tooltip } from '@nextui-org/react'
import { FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

const HeaderWorker = () => {
  const router = useRouter()
  return (
    <Tooltip
      content="Voltar"
      placement="bottom-end"
      className="text-white"
      color="primary"
    >
      <Button
        color="primary"
        isIconOnly
        onClick={() => router.push('/worker')}
        className="rounded-full text-white"
      >
        <FaArrowLeft size={20} className="text-white" />
      </Button>
    </Tooltip>
  )
}

export default HeaderWorker
