'use client'
import { ClientProps } from '@/types/client'
import { getData } from '@/utils/functions.api'
import {
  Button,
  Chip,
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
  Select,
  SelectItem,
  Skeleton,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { firstDeployClients } from '@/app/(logged)/client/constants'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { useRecordHook } from '@/app/(logged)/record/hooks'
import { RolProps } from '@/types/rol'
import { Calendar } from 'components/ui/calendar'
import { ptBR } from 'date-fns/locale'
import { FilterRecordProps } from '@/app/(logged)/record/types'
import { Row } from 'components/grid/row'
import { FilterMonitoringProps } from '@/app/(logged)/monitoring/rols/types'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { nanoid } from 'nanoid'
import { useCart } from '@/app/(logged)/rol/cart/hook'
const Records = () => {
  const router = useRouter()

  const { setCart, setTempCart, setIsViewOnly } = useCart()

  const recordHook = useRecordHook()

  const { data: dataRol, isLoading: loadingRol } = useQuery({
    queryFn: ({ signal }) =>
      getData<RolProps[]>({
        url: 'rol',
        signal,
        query:
          `include.client=true&&include.products.include.status` +
          `&&where.createdAt.gte=${recordHook.dateStart}&&` +
          `where.createdAt.lte=${recordHook.dateEnd}`,
      }),
    queryKey: ['rol-get', recordHook],
  })

  const { data: dataGetClients, isLoading: loadingGetClient } = useQuery({
    queryFn: ({ signal }) =>
      getData<ClientProps[]>({
        url: 'client',
        signal,
        query: 'orderBy.fantasyName=asc&&include.address=true',
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

  const { handleSubmit, setValue, control } = useForm<
    FilterRecordProps,
    'filter'
  >()

  const dataClients = dataRol?.map((a) => a.client)

  const clientsUnique = dataClients
    ?.map((a) => a)
    .filter(
      (v, i, a) =>
        a.findIndex(
          (t) => t?.id === v?.id && t?.fantasyName === v?.fantasyName,
        ) === i,
    )

  const search = ''

  const hasSearchFilter = Boolean('true')

  const filteredData = useMemo(() => {
    if (!dataRol?.length) return []
    let filteredData = [...dataRol]

    console.log('filteredData', filteredData)

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

  const onSubmit = (data: FilterRecordProps) => {
    console.log('data', data)
    const tempRols = dataRol?.filter(
      (a) => data.rolIds?.includes(a.id.toString()),
    )
    if (!tempRols) {
      toast.error('Rol não encontrado')
      return
    } else if (tempRols.length > 0) recordHook.setRols(tempRols)
    if (data.clientIds?.length) recordHook.setClientIds(data.clientIds)
    if (data.dateEnd) recordHook.setDateEnd(data.dateEnd?.toISOString())
    if (data.dateStart) recordHook.setDateStart(data.dateStart?.toISOString())

    recordHook.setIsFilterOpen(false)
  }

  const loading = loadingGetClient || loadingRol

  return (
    <div className="flex w-full flex-col gap-4">
      <Listbox
        items={items ?? []}
        aria-label="Rols"
        onAction={(item) => {
          setIsViewOnly(true)
          router.push(`rol/cart?id=${item}&fromRecord=true`)
        }}
        emptyContent="Nenhum cliente encontrado"
      >
        {(item) => (
          <ListboxItem key={item.id} textValue={String(item.id)}>
            <div className="flex flex-col gap-2">
              <span className="font-bold">
                {(item.client?.fantasyName ?? item.client?.fantasyName) +
                  ' - ROL: ' +
                  item.id}
              </span>
              <small className="text-tiny text-default-400">
                {format(item.createdAt, 'dd/MM/yyyy HH:mm')}
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

      <Modal
        isOpen={recordHook.isFilterOpen}
        backdrop="opaque"
        classNames={{
          backdrop: 'blur-md',
        }}
        onOpenChange={(open) => {
          recordHook.setIsFilterOpen(open)
        }}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="mt-4 flex flex-col gap-1">
                Filtrar
              </ModalHeader>
              <ModalBody>
                <div className={'flex flex-col gap-2 text-default-600'}>
                  <form
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex w-full flex-col gap-4"
                    id="formRol"
                  >
                    <Controller
                      name="rolIds"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <Skeleton className="rounded-md" isLoaded={!loadingRol}>
                          <Select
                            label="Rols"
                            id={field.name}
                            onSelectionChange={(value) =>
                              field.onChange(Array.from(value))
                            }
                            name={field.name}
                            selectedKeys={
                              Array.isArray(field.value)
                                ? new Set(field.value)
                                : new Set()
                            }
                            variant="bordered"
                            color="primary"
                            isInvalid={!!error}
                            errorMessage={error?.message}
                            classNames={{
                              value: 'text-foreground',
                              label: 'overflow-visible',
                            }}
                            isLoading={loadingRol}
                            items={dataRol ?? []}
                            selectionMode="multiple"
                            isMultiline={(field.value?.length ?? 0) > 0}
                            renderValue={(items) => {
                              return (
                                <div className="flex flex-wrap gap-2">
                                  {items.map((item) => (
                                    <div key={item.key}>
                                      <Chip
                                        isCloseable
                                        onClose={() => {
                                          setValue(
                                            field.name,
                                            field.value?.filter(
                                              (a) => a !== item.key?.toString(),
                                            ),
                                          )
                                        }}
                                      >
                                        {item.data?.id}
                                      </Chip>
                                    </div>
                                  ))}
                                </div>
                              )
                            }}
                          >
                            {(item) => (
                              <SelectItem
                                key={item.id}
                                className="capitalize"
                                textValue={String(item.id)}
                              >
                                <div className="flex flex-col gap-2">
                                  <span className="font-bold">{item.id}</span>
                                  <small className="text-tiny text-default-400">
                                    {item.client?.fantasyName}
                                  </small>
                                </div>
                              </SelectItem>
                            )}
                          </Select>
                        </Skeleton>
                      )}
                    />
                    {clientsUnique && (
                      <Controller
                        name="clientIds"
                        control={control}
                        // defaultValue={dataClient?.map((a) => a.id.toString())}
                        render={({ field, fieldState: { error } }) => (
                          <Skeleton
                            className="rounded-md"
                            isLoaded={!loadingRol}
                          >
                            <Select
                              label="Clientes"
                              id={field.name}
                              onSelectionChange={(value) =>
                                field.onChange(Array.from(value))
                              }
                              name={field.name}
                              selectedKeys={
                                Array.isArray(field.value)
                                  ? new Set(field.value)
                                  : new Set()
                              }
                              variant="bordered"
                              color="primary"
                              isInvalid={!!error}
                              errorMessage={error?.message}
                              classNames={{
                                value: 'text-foreground',
                                label: 'overflow-visible',
                              }}
                              isLoading={loadingRol}
                              items={clientsUnique ?? []}
                              selectionMode="multiple"
                              isMultiline={(field.value?.length ?? 0) > 0}
                              renderValue={(items) => {
                                return (
                                  <div className="flex flex-wrap gap-2">
                                    {items.map((item) => (
                                      <div key={item.key}>
                                        <Chip
                                          isCloseable
                                          onClose={() => {
                                            setValue(
                                              field.name,
                                              field.value?.filter(
                                                (a) =>
                                                  a !== item.key?.toString(),
                                              ),
                                            )
                                          }}
                                        >
                                          {item.data?.fantasyName}
                                        </Chip>
                                      </div>
                                    ))}
                                  </div>
                                )
                              }}
                            >
                              {(item) => (
                                <SelectItem
                                  key={item?.id ?? ''}
                                  className="capitalize"
                                  textValue={String(item?.id)}
                                >
                                  <span>{item?.fantasyName}</span>
                                </SelectItem>
                              )}
                            </Select>
                          </Skeleton>
                        )}
                      />
                    )}
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        Data inicial
                        <Controller
                          name="dateStart"
                          control={control}
                          defaultValue={new Date(recordHook.dateStart)}
                          render={({ field }) => (
                            <Skeleton
                              className="rounded-md"
                              isLoaded={!loading}
                            >
                              <Calendar
                                locale={ptBR}
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  console.log(date)
                                  // se recordHook.dateEnd for menor que dateStart, setar recordHook.dateEnd = dateStart
                                  if (date) {
                                    if (
                                      recordHook.dateEnd &&
                                      new Date(recordHook.dateEnd) < date
                                    ) {
                                      recordHook.setDateEnd(date?.toISOString())
                                    }
                                  }
                                  field.onChange(date)
                                }}
                                className="rounded-md border"
                                disabled={
                                  // allDaays after today, but set UTC to -3
                                  (date) =>
                                    date.getTime() >
                                    new Date(
                                      new Date().setUTCHours(
                                        new Date().getUTCHours() - 3,
                                      ),
                                    ).getTime()
                                }
                              />
                            </Skeleton>
                          )}
                        />
                      </div>
                      <div className="flex flex-col">
                        Data final
                        <Controller
                          name="dateEnd"
                          control={control}
                          defaultValue={new Date(recordHook.dateEnd)}
                          render={({ field }) => (
                            <Skeleton
                              className="rounded-md"
                              isLoaded={!loading}
                            >
                              <Calendar
                                locale={ptBR}
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  console.log(date)
                                  field.onChange(date)
                                }}
                                className="rounded-md border"
                                disabled={
                                  // allDaays after today, but set UTC to -3
                                  (date) =>
                                    date.getTime() >
                                    new Date(
                                      new Date().setUTCHours(
                                        new Date().getUTCHours() - 3,
                                      ),
                                    ).getTime()
                                }
                              />
                            </Skeleton>
                          )}
                        />
                      </div>
                    </div>
                  </form>
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
                  Cancelar
                </Button>
                <Button
                  form="formRol"
                  type="submit"
                  variant="flat"
                  color="primary"
                  className="w-fit"
                >
                  Filtrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Records
