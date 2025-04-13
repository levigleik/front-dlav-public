'use client'
import React from 'react'
import { cn, Image } from '@nextui-org/react'
import { MdOutlineImageNotSupported } from 'react-icons/md'
import NextImage from 'next/image'
import { ProductDefaultProps } from '@/app/(logged)/product/[id]/types'
import { formatBRL } from '@/utils/functions'

export const ProductTabProduct: React.FC<{
  product: ProductDefaultProps
  onClick: () => void
}> = ({ product, onClick }) => {
  // const { product } = useRolHook()
  if (!product) return null
  return (
    <>
      {/*{!product && (*/}
      {/*  <div className="flex justify-center">Nenhum produto selecionado</div>*/}
      {/*)}*/}

      <div
        className={cn(
          'm-0 mt-4 flex flex-col',
          'max-w-md bg-content1 hover:bg-default-100',
          'items-center justify-between',
          'cursor-pointer gap-6 rounded-lg border-2 border-transparent p-4',
          'data-[selected=true]:border-primary',
        )}
        onClick={onClick}
      >
        <div className="flex items-center justify-center">
          {product.photos &&
            product.photos.map((photo) => (
              <Image
                key={photo}
                src={photo}
                alt={product.name}
                as={NextImage}
                width={180}
                height={180}
                className="rounded-md"
              />
            ))}
          {!product.photos?.length && <MdOutlineImageNotSupported size={84} />}
        </div>
        <div className="flex flex-col p-3">
          <span className="text-center font-bold text-default-700">
            {product.name}
          </span>
          <span className="text-center text-sm text-default-500">
            {product.description}
          </span>
          <span className="text-center ">
            {formatBRL.format(Number(product.price ?? 0))}
          </span>
        </div>
      </div>
    </>
  )
}
