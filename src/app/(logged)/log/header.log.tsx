'use client'

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Tooltip,
} from '@nextui-org/react'
import { FaFilter, FaSortAmountDown, FaTimes } from 'react-icons/fa'
import React from 'react'
import { format } from 'date-fns'
import { useLogHook } from '@/app/(logged)/log/hooks'

const HeaderLog = () => {
  const logHook = useLogHook()

  return (
    <div className="flex items-center justify-between gap-5">
      <span className="text-lg">
        Todos os logs de{' '}
        <i>
          {format(logHook.dateStart, 'dd/MM/yyyy')} até{' '}
          {format(logHook.dateEnd, 'dd/MM/yyyy')}
        </i>
      </span>
      <div className="flex gap-4">
        {(logHook.orderBy ||
          logHook.rols?.length ||
          logHook.clientIds?.length) && (
          <Tooltip
            content="Limpar filtros"
            placement="bottom-end"
            className="text-white"
            color="danger"
          >
            <Button
              isIconOnly
              radius={'full'}
              color="danger"
              type="button"
              onClick={() => {
                logHook.clear()
              }}
            >
              <FaTimes className="text-white" size={20} />
            </Button>
          </Tooltip>
        )}
        <Dropdown>
          <DropdownTrigger>
            <Button
              type="button"
              color="primary"
              className="w-fit rounded-full text-main-white"
              isIconOnly
              title="Ordenar por"
            >
              <FaSortAmountDown size={20} className="text-white" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(key) => {
              logHook.setOrderBy(key as 'date')
            }}
            aria-label="Ordernar por"
          >
            <DropdownSection title="Ordernar por">
              <DropdownItem key="date">Data</DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
        <Tooltip
          content="Filtrar"
          placement="bottom-end"
          className="text-white"
          color="primary"
        >
          <Button
            isIconOnly
            radius={'full'}
            color="primary"
            type="button"
            onClick={() => {
              logHook.setIsFilterOpen(!logHook.isFilterOpen)
            }}
          >
            <FaFilter className="text-white" size={20} />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}

export default HeaderLog
