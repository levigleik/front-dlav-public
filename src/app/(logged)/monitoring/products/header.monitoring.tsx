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
import { useMonitoringProductHook } from '@/app/(logged)/monitoring/products/hooks'

const HeaderMonitoring = () => {
  const monitoringHook = useMonitoringProductHook()

  return (
    <div className="flex items-center justify-between gap-5">
      <span className="text-lg">
        {monitoringHook.rols
          ? `Rols: ${monitoringHook.rols?.map((rol) => rol.id).join(', ')}`
          : 'Todos os rols em andamento'}
      </span>
      <div className="flex gap-4">
        {(monitoringHook.orderBy ||
          monitoringHook.rols?.length ||
          monitoringHook.clientIds?.length) && (
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
                monitoringHook.clear()
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
              monitoringHook.setOrderBy(key as 'name' | 'status' | 'client')
            }}
            aria-label="Ordernar por"
          >
            <DropdownSection title="Ordernar por">
              <DropdownItem key="name">Nome</DropdownItem>
              <DropdownItem key="status">Status</DropdownItem>
              <DropdownItem key="client">Cliente</DropdownItem>
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
              monitoringHook.setIsFilterOpen(!monitoringHook.isFilterOpen)
            }}
          >
            <FaFilter className="text-white" size={20} />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}

export default HeaderMonitoring
