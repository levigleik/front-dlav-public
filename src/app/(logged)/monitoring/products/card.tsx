'use client'

import { cn } from '@nextui-org/react'
import { ProductRolProps } from '@/types/productRol'
import React from 'react'
import { formatBRL } from '@/utils/functions'
import { format } from 'date-fns'
import { useMonitoringProductHook } from '@/app/(logged)/monitoring/products/hooks'

interface DraggableProductRolProps {
  item: { id: string; content: ProductRolProps<any> }
}
const CardProductRol = ({ item }: DraggableProductRolProps) => {
  const { setIsProductModalOpen, isProductModalOpen } =
    useMonitoringProductHook()

  return (
    <div
      key={item.id}
      className={cn(
        'min-h-64 flex w-full min-w-max cursor-pointer',
        'items-center gap-2 rounded-large bg-main-300',
        'p-2 py-4 shadow-small md:px-8',
        `${item.content.urgency ? 'bg-red-600' : ''}`,
      )}
      title={item.content.urgency ? 'Urgente' : item.content.name}
      onClick={() => {
        setIsProductModalOpen(!isProductModalOpen, Number(item.id))
      }}
    >
      <div className="flex flex-col gap-4 ">
        <span className="text-lg font-bold">
          {item.content.name} ({formatBRL.format(item.content.price)})
        </span>
        <span>
          Status: <b>{item.content.status?.name}</b>
        </span>
        <span>
          Rol: <b>{item.content.rol?.id}</b>
        </span>
        <span>
          Cliente: <b>{item.content.rol?.client?.fantasyName}</b>
        </span>
        {item.content.urgency && item.content.urgencyDate && (
          <span>
            Prazo de entrega:{' '}
            <b>{format(item.content.urgencyDate, 'dd/MM/yyyy HH:mm')}</b>
          </span>
        )}
      </div>
    </div>
  )
}

export default CardProductRol
