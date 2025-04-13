'use client'

import { Link } from '@nextui-org/react'
import { FaExclamationTriangle } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Erro 404</h1>
      <FaExclamationTriangle size={50} className="mb-4 text-2xl" />
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <Link href="/" color="foreground" className={'mt-8'}>
        Voltar para a página inicial
      </Link>
    </div>
  )
}
