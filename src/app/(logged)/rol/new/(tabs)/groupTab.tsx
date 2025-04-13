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
import { GroupProps } from '@/types/group'

const GroupTab = () => {
  const { search, setGroupId, setTab, clientId, groupId, priceListId } =
    useRolHook()

  const { data: dataGetGroups, isLoading: loadingGetGroup } = useQuery({
    queryFn: ({ signal }) =>
      getData<GroupProps<any, any>[]>({
        url: 'group',
        signal,
        query: `orderBy.name=asc&&where.priceListId=${priceListId}`,
      }),
    queryKey: ['group-get', priceListId],
  })

  const hasSearchFilter = Boolean(search)

  const filteredData = useMemo(() => {
    if (!dataGetGroups?.length) return []
    let filteredData = [...dataGetGroups]

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        // filter by CNPJ
        String(item.name).toLowerCase().includes(search.toLowerCase()),
      )
    }

    return filteredData
  }, [dataGetGroups, hasSearchFilter, search])

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

  useEffect(() => {
    console.log('clientId', clientId)
    console.log('groupId', groupId)
    console.log('priceListId', priceListId)
  }, [clientId, groupId, priceListId])

  return (
    <div className="flex w-full flex-col gap-4">
      <TabsFunc
        onChange={() => {
          setPage(1)
        }}
      />
      {loadingGetGroup && <Loading />}
      <Listbox
        items={items ?? []}
        aria-label="Grupos de produtos"
        onAction={(key) => {
          setGroupId(Number(key))
          setTab('4')
        }}
        emptyContent="Nenhum grupo encontrado para essa tabela de preço"
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

export default GroupTab
