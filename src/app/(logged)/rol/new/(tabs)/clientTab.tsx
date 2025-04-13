'use client'
import { ClientProps } from '@/types/client'
import { getData } from '@/utils/functions.api'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  useDisclosure,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRolHook } from '../hook'
import TabsFunc from '../tabs'

import { firstDeployClients } from '@/app/(logged)/client/constants'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/(logged)/rol/cart/hook'
const ClientTab = () => {
  const {
    search,
    setClientId,
    setTab,
    clientId,
    groupId,
    priceListId,
    editClient,
    setIsWashControl,
  } = useRolHook()

  const { productTemp: product, cart, setCart, clearCart } = useCart()

  const router = useRouter()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const { data: dataGetClients, isLoading: loadingGetClient } = useQuery({
    queryFn: ({ signal }) =>
      getData<ClientProps[]>({
        url: 'client',
        signal,
        query:
          `orderBy.fantasyName=asc&&include.address=true` +
          `&&include.employees.include.washControlEmployees=true`,
      }),
    queryKey: ['client-get'],
    select: (data) => {
      const parseData = data?.filter((item) =>
        firstDeployClients.some((item2) =>
          item.fantasyName.toLowerCase().includes(item2.toLowerCase()),
        ),
      )
      // let filteredClients = parseData.filter((client) =>
      //   uniqueIdsFirstDeploy.includes(client.id),
      // )
      //
      // console.log(filteredClients)
      return parseData
    },
  })

  const hasSearchFilter = Boolean(search)

  const filteredData = useMemo(() => {
    if (!dataGetClients?.length) return []
    let filteredData = [...dataGetClients]

    if (hasSearchFilter) {
      filteredData = filteredData.filter(
        (item) =>
          // filter by address.publicArea
          String(item.address?.publicArea)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          // filter by CNPJ
          String(item.cnpj).toLowerCase().includes(search.toLowerCase()) ||
          String(item.fantasyName).toLowerCase().includes(search.toLowerCase()),
      )
    }

    return filteredData
  }, [dataGetClients, hasSearchFilter, search])

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
    console.log('product', product)
    console.log('clientId', clientId)
    console.log('groupId', groupId)
    console.log('priceListId', priceListId)
  }, [clientId, groupId, priceListId, product])

  return (
    <div className="flex w-full flex-col gap-4">
      <TabsFunc
        onChange={() => {
          setPage(1)
        }}
      />
      <Modal
        isOpen={isOpen}
        backdrop="opaque"
        classNames={{
          backdrop: 'blur-md',
        }}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="mt-4 flex flex-col gap-1">
                Deseja zerar o carrinho?
              </ModalHeader>
              <ModalBody>
                <div className={'flex flex-col gap-2 text-default-600'}>
                  Você já tem produtos no carrinho para o cliente{' '}
                  <b>
                    {cart?.client?.fantasyName ?? cart?.client?.corporateName}
                  </b>{' '}
                  deseja zerar o carrinho e adicionar um novo cliente?
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose()
                  }}
                >
                  Não
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose()
                    clearCart()

                    const employeeHasWashControl = dataGetClients
                      ?.find((item) => item.id === clientId)
                      ?.employees?.some(
                        (item) => item.washControlEmployees?.length,
                      )
                    console.log(employeeHasWashControl)
                    if (employeeHasWashControl) {
                      setIsWashControl(true)
                      setTab('6')
                    } else setTab('2')
                  }}
                >
                  Sim
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Listbox
        items={items ?? []}
        aria-label="Clientes"
        onAction={(key) => {
          if (editClient) {
            setCart({
              ...cart,
              client: dataGetClients?.find((item) => item.id === Number(key)),
            } as any)
            router.push(`/rol/cart`)
          }
          // setTab('2')
          // setClientId(Number(key))
          else {
            setClientId(Number(key))
            if (cart?.products?.length && cart?.client?.id !== Number(key)) {
              onOpen()
            } else {
              const employeeHasWashControl = dataGetClients
                ?.find((item) => item.id === Number(key))
                ?.employees?.some((item) => item.washControlEmployees?.length)
              if (employeeHasWashControl) {
                setIsWashControl(true)
                setTab('6')
              } else setTab('2')
            }
          }
        }}
        emptyContent="Nenhum cliente encontrado"
      >
        {(item) => (
          <ListboxItem key={item.id} textValue={item.fantasyName}>
            <div className="flex flex-col gap-2">
              <span className="font-bold">{item.fantasyName}</span>
              <small className="text-tiny text-default-400">
                {item.address?.publicArea}, {item.address?.number}
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

export default ClientTab
