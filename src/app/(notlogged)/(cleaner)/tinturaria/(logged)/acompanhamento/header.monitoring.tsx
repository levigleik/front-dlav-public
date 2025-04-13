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
import { useCleanerMonitoringHook } from '@/app/(notlogged)/(cleaner)/tinturaria/(logged)/acompanhamento/hooks'

const HeaderCleanerMonitoring = () => {
  const cleanerMonitoringHook = useCleanerMonitoringHook()

  return (
    <div className="flex items-center justify-between gap-5">
      <span className="text-lg">Todos os registros</span>
      <div className="flex gap-4">
        {(cleanerMonitoringHook.orderBy ||
          cleanerMonitoringHook.rols?.length ||
          cleanerMonitoringHook.clientIds?.length) && (
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
                cleanerMonitoringHook.clear()
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
              cleanerMonitoringHook.setOrderBy(key as 'name')
            }}
            aria-label="Ordernar por"
          >
            <DropdownSection title="Ordernar por">
              <DropdownItem key="name">Nome</DropdownItem>
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
              cleanerMonitoringHook.setIsFilterOpen(
                !cleanerMonitoringHook.isFilterOpen,
              )
            }}
          >
            <FaFilter className="text-white" size={20} />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}

export default HeaderCleanerMonitoring
