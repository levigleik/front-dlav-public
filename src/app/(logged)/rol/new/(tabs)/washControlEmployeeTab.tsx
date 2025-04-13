'use client'
import Loading from '@/components/loading'
import { getData } from '@/utils/functions.api'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Listbox,
  ListboxItem,
  Pagination,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRolHook } from '../hook'
import TabsFunc from '../tabs'
import { EmployeeProps } from '@/types/employee'
import { ClientProps } from '@/types/client'

const WashControlEmployeeTab = () => {
  const { search, setEmployeeId, setTab, clientId } = useRolHook()

  const { data: dataGetEmployees, isLoading: loadingGetEmployee } = useQuery({
    queryFn: ({ signal }) =>
      getData<EmployeeProps<ClientProps>[]>({
        url: 'employee',
        signal,
        query: `orderBy.name=asc&&where.clientId=${clientId}`,
      }),
    queryKey: ['employee-get', clientId],
  })

  const hasSearchFilter = Boolean(search)

  const filteredData = useMemo(() => {
    if (!dataGetEmployees?.length) return []
    let filteredData = [...dataGetEmployees]

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        // filter by CNPJ
        String(item.name).toLowerCase().includes(search.toLowerCase()),
      )
    }

    return filteredData
  }, [dataGetEmployees, hasSearchFilter, search])

  const [page, setPage] = useState(1)

  const [rowsPerPage, setRowsPerPage] = useState(10)
  const onRowsPerPageChange = useCallback((value: number) => {
    setRowsPerPage(value)
    setPage(1)
  }, [])

  const rowsPagination = useMemo(() => [5, 10, 15, 20, 50, 100], [])

  const pages = Math.ceil(filteredData.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredData.slice(start, end)
  }, [page, filteredData, rowsPerPage])

  return (
    <div className="flex w-full flex-col gap-4">
      <TabsFunc
        onChange={() => {
          setPage(1)
        }}
      />
      {loadingGetEmployee && <Loading />}
      <Listbox
        items={items ?? []}
        aria-label="Empregados"
        onAction={(key) => {
          setEmployeeId(Number(key))
          setTab('7')
        }}
        emptyContent="Nenhum empregado encontrado para esse cliente"
      >
        {(item) => (
          <ListboxItem key={item.id} textValue={item.name}>
            <span className="font-bold">{item.name}</span>
          </ListboxItem>
        )}
      </Listbox>
      <Pagination
        showControls
        showShadow
        color="primary"
        size="sm"
        initialPage={page}
        page={page}
        total={pages === 0 ? 1 : pages}
        onChange={setPage}
        variant="light"
        classNames={{ cursor: 'font-bold text-white' }}
      />
      <div className="flex items-center justify-between">
        <span className="text-small dark:text-default-400">
          Total de {filteredData.length} registros
        </span>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" size="sm">
              <span className="mr-2 text-small dark:text-default-400">
                Paginação de
              </span>
              {rowsPerPage}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            variant="light"
            aria-label="Paginação"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={[rowsPerPage]}
          >
            {rowsPagination.map((value) => (
              <DropdownItem
                key={value}
                onClick={() => onRowsPerPageChange(value)}
              >
                {value}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  )
}

export default WashControlEmployeeTab
