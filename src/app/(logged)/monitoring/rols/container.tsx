'use client'
import { cn } from '@nextui-org/react'
import React from 'react'

interface DroppableProductRolProps {
  children: React.ReactNode
  titleName: string
}
const ContainerProductRol = ({
  children,
  titleName,
}: DroppableProductRolProps) => {
  return (
    <div
      className={cn(
        'flex w-full min-w-max flex-col gap-4',
        'rounded-large bg-default-300 px-4 py-4',
        'shadow-small md:px-8',
      )}
    >
      <span className="text-center text-lg font-bold">{titleName}</span>
      {children}
    </div>
  )
}

export default ContainerProductRol
