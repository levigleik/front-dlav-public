'use client'

import { useMonitoringRolHook } from '@/app/(logged)/monitoring/rols/hooks'
import { cn, Progress } from '@nextui-org/react'
import React from 'react'
import { RolProps } from '@/types/rol'

interface DraggableRolProps {
  item: RolProps
}
const CardRol = ({ item }: DraggableRolProps) => {
  const { setIsProductModalOpen, isProductModalOpen } = useMonitoringRolHook()

  const companyName = item.client?.fantasyName ?? item.client?.corporateName

  return (
    <div
      key={item.id}
      className={cn(
        'min-h-64 flex w-full min-w-max cursor-pointer',
        'items-center gap-2 rounded-large bg-main-300',
        'p-2 py-4 shadow-small md:px-8',
      )}
      onClick={() => {
        setIsProductModalOpen(!isProductModalOpen, Number(item.id))
      }}
    >
      <div className="flex w-full flex-col gap-3">
        <span className="mb-3 text-lg font-bold">{companyName}</span>
        <span className="flex w-full items-center gap-4">
          Status:{' '}
          <Progress
            color="success"
            title={
              !item?.productGroups
                ? 'Nenhum lote'
                : (item?.productGroups?.filter((a) => a.productStatusId === 11)
                    .length ?? 1) +
                  ' / ' +
                  (item?.productGroups?.length ?? 1)
            }
            value={
              ((item?.productGroups?.filter((a) => a.productStatusId === 11)
                .length ?? 1) /
                (item?.productGroups?.length ?? 1)) *
              100
            }
          />
          <span className={'w-full'}>
            {!item?.productGroups
              ? 'Nenhum lote'
              : (item?.productGroups?.filter((a) => a.productStatusId === 11)
                  .length ?? 1) +
                ' / ' +
                (item?.productGroups?.length ?? 1)}
          </span>
        </span>

        <span>
          Rol: <b>{item?.id}</b>
        </span>
      </div>
    </div>
  )
}

export default CardRol
