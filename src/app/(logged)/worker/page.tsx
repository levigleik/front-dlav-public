'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Listbox,
  ListboxItem,
  Pagination,
  useDisclosure,
} from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getData } from '@/utils/functions.api'
import { RolProps } from '@/types/rol'
import { FaExclamationTriangle, FaSearch } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Loading from 'components/loading'

const RolNew = () => {
  const [search, setSearch] = useState('')
  const placeholder = 'Procure pelo nome, endereço, telefone ou CNPJ'

  const router = useRouter()

  const [hasLocation, setHasLocation] = useState(false)

  const {
    data: dataRol,
    isLoading: loadingRol,
    refetch,
  } = useQuery({
    queryFn: ({ signal }) =>
      getData<RolProps[]>({
        url: 'rol',
        signal,
        query:
          'include.client.include.address=true&&' +
          `include.productGroups&&orderBy.createdAt=asc&&` +
          `where.status=paused`,
      }),
    queryKey: ['monitoring-rol-get'],
    refetchInterval: 5000,
  })

  const hasSearchFilter = Boolean(search)

  const filteredData = useMemo(() => {
    if (!dataRol?.length) return []
    let filteredData = [...dataRol]

    if (hasSearchFilter) {
      filteredData = filteredData.filter(
        (item) =>
          // filter by address.publicArea
          String(item.client?.address?.publicArea)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          // filter by CNPJ
          String(item.client?.cnpj)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          String(item.client?.fantasyName)
            .toLowerCase()
            .includes(search.toLowerCase()),
      )
    }

    return filteredData
  }, [dataRol, hasSearchFilter, search])

  const [page, setPage] = useState(1)

  const [rowsPerPage, setRowsPerPage] = useState(10)
  const onRowsPerPageChange = useCallback((value: number) => {
    setRowsPerPage(value)
    setPage(1)
  }, [])

  const rowsPagination = useMemo(() => [10, 15, 20, 50, 100], [])

  const pages = Math.ceil(filteredData.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredData.slice(start, end)
  }, [page, filteredData, rowsPerPage])

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error('Localização não suportada no seu navegador')
    } else {
      setHasLocation(true)
    }
  }, [setHasLocation])

  return !hasLocation ? (
    <div className="flex items-center justify-center text-white">
      <h1 className="flex flex-col items-center justify-center gap-4 rounded-lg bg-danger-200 p-4">
        <FaExclamationTriangle size={32} />
        Sem localização, para continuar, permita o acesso à localização
      </h1>
    </div>
  ) : (
    <div className="flex w-full flex-col gap-4">
      <Input
        className="w-full"
        size="sm"
        classNames={{
          inputWrapper: 'rounded-full h-10',
          input: 'px-4',
        }}
        placeholder={placeholder}
        title={placeholder}
        aria-label={placeholder}
        onChange={(e) => {
          setSearch(e.target.value)
        }}
        value={search}
        startContent={<FaSearch className="mr-2 hidden md:flex" size={20} />}
      />
      {loadingRol && <Loading />}
      <Listbox
        items={items ?? []}
        aria-label="Rols"
        onAction={(key) => {
          router.push(`/worker/${key}`)
        }}
        emptyContent="Nenhum cliente encontrado"
      >
        {(item) => (
          <ListboxItem key={item.id} textValue={String(item.id)}>
            <div className="flex flex-col gap-2">
              <span className="font-bold">{item.client?.fantasyName}</span>
              <small className="text-tiny text-default-400">
                {item.client?.address?.publicArea},{' '}
                {item.client?.address?.number}
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
}

export default RolNew
