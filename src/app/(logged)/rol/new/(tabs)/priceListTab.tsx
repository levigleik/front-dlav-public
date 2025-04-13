'use client'
import Loading from '@/components/loading'
import { ClientProps } from '@/types/client'
import { PriceListProps } from '@/types/priceList'
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
import { useCallback, useMemo, useState } from 'react'
import { useRolHook } from '../hook'
import TabsFunc from '../tabs'

const PriceListTab = () => {
  const { search, clientId, setPriceListId, setTab } = useRolHook()

  const { data: dataGetPriceLists, isLoading: loadingGetPriceList } = useQuery({
    queryFn: ({ signal }) =>
      getData<PriceListProps<any, any, ClientProps>[]>({
        url: 'priceList',
        signal,
        query: `orderBy.name=asc&&include.client=true&&where.clientId=${clientId}`,
      }),
    queryKey: ['price-list-get', clientId],
  })

  const hasSearchFilter = Boolean(search)

  const filteredData = useMemo(() => {
    if (!dataGetPriceLists?.length) return []
    let filteredData = [...dataGetPriceLists]

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        // filter by CNPJ
        String(item.name).toLowerCase().includes(search.toLowerCase()),
      )
    }

    return filteredData
  }, [dataGetPriceLists, hasSearchFilter, search])

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
      {loadingGetPriceList && <Loading />}
      <Listbox
        items={items ?? []}
        aria-label="Tabelas de preços"
        onAction={(key) => {
          setPriceListId(Number(key))
          setTab('3')
        }}
        emptyContent="Nenhuma tabela encontrada para esse cliente"
      >
        {(item) => (
          <ListboxItem key={item.id} textValue={item.name}>
            <div className="flex flex-col gap-2">
              <span className="font-bold">{item.name}</span>
              <small>Cliente: {item.client?.fantasyName}</small>
            </div>
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

export default PriceListTab
