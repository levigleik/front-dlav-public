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
import { useMonitoringRolHook } from '@/app/(logged)/monitoring/rols/hooks'
import React from 'react'
import { useRecordHook } from '@/app/(logged)/record/hooks'
import { format } from 'date-fns'
import { ColumnProps } from 'components/table/types'

const HeaderRecord = () => {
  const recordHook = useRecordHook()

  return (
    <div className="flex items-center justify-between gap-5">
      <span className="text-lg">
        Todos os registros de{' '}
        <i>
          {format(recordHook.dateStart, 'dd/MM/yyyy')} até{' '}
          {format(recordHook.dateEnd, 'dd/MM/yyyy')}
        </i>
      </span>
      <div className="flex gap-4">
        {(recordHook.orderBy ||
          recordHook.rols?.length ||
          recordHook.clientIds?.length) && (
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
                recordHook.clear()
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
              recordHook.setOrderBy(key as 'date')
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
              recordHook.setIsFilterOpen(!recordHook.isFilterOpen)
            }}
          >
            <FaFilter className="text-white" size={20} />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}

export default HeaderRecord
