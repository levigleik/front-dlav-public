'use client'
import Loading from '@/components/loading'
import { getData } from '@/utils/functions.api'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { useRolHook } from '../hook'
import TabsFunc from '../tabs'
import { ProductDefaultProps } from '@/app/(logged)/product/[id]/types'
import { ProductTabProduct } from '@/app/(logged)/rol/new/(tabs)/productTab.product'
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
import { formatBRL } from '@/utils/functions'
import { useCart } from '@/app/(logged)/rol/cart/hook'

const ProductTab = ({
  groupStyle = 'list',
}: {
  groupStyle: 'list' | 'grid'
}) => {
  const { search, groupId, setTab } = useRolHook()
  const { setProductTemp: setProduct } = useCart()

  const { data: dataGetProducts, isLoading: loadingGetProduct } = useQuery({
    queryFn: ({ signal }) =>
      getData<ProductDefaultProps[]>({
        url: 'product',
        signal,
        query: `orderBy.name=asc&&where.groupId=${groupId}&&include.group=true`,
      }),
    queryKey: ['product-get', groupId],
  })

  const hasSearchFilter = Boolean(search)

  const [page, setPage] = useState(1)

  const [rowsPerPage, setRowsPerPage] = useState(10)
  const onRowsPerPageChange = useCallback((value: number) => {
    setRowsPerPage(value)
    setPage(1)
  }, [])

  const rowsPagination = useMemo(() => [10, 15, 20, 50, 100], [])

  const filteredData = useMemo(() => {
    if (!dataGetProducts?.length) return []
    let filteredData = [...dataGetProducts]

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        String(item.name).toLowerCase().includes(search.toLowerCase()),
      )
    }

    return filteredData
  }, [dataGetProducts, hasSearchFilter, search])

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredData.slice(start, end)
  }, [page, filteredData, rowsPerPage])

  const pages = Math.ceil(filteredData.length / rowsPerPage)

  if (groupStyle === 'list')
    return (
      <div className="flex w-full flex-col gap-4">
        <TabsFunc
          onChange={() => {
            setPage(1)
          }}
        />
        <Listbox
          items={items ?? []}
          aria-label="Produtos"
          onAction={(productKey) => {
            const product = items.find((item) => String(item.id) === productKey)
            setProduct(product as any)
            setTab('5')
          }}
          emptyContent="Nenhum produto encontrado"
        >
          {(item) => (
            <ListboxItem key={item.id} textValue={item.name}>
              <div className="flex flex-col gap-2">
                <span className="font-bold">{item.name}</span>
                <small className="text-tiny text-default-400">
                  {formatBRL.format(Number(item.price ?? 0))}
                </small>
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

  return (
    <div className="flex w-full flex-col gap-6">
      <TabsFunc />
      {loadingGetProduct && <Loading />}
      {items.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6">
          {items.map((item, index) => (
            <ProductTabProduct
              onClick={() => {
                setProduct(item as any)
                setTab('5')
              }}
              key={index}
              product={item}
            />
          ))}
        </div>
      )}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-6">
          <span className="text-center text-default-500">
            Nenhum produto no grupo
          </span>
        </div>
      )}
    </div>
  )
}

export default ProductTab
