'use client'
import { getData } from '@/utils/functions.api'
import {
  Accordion,
  AccordionItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Skeleton,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { Calendar } from 'components/ui/calendar'
import { ptBR } from 'date-fns/locale'
import { FilterRecordProps } from '@/app/(logged)/record/types'
import { LogsProps } from '@/types/logs'
import { useCleanerMonitoringHook } from '@/app/(notlogged)/(cleaner)/tinturaria/(logged)/acompanhamento/hooks'
import { useAuthState } from '@/hook/auth'
import { format } from 'date-fns'
import { RolProps } from '@/types/rol'

const Logs = () => {
  const router = useRouter()

  const cleanerMonitoringHook = useCleanerMonitoringHook()

  const { profileCleaner } = useAuthState()

  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  const { data: dataLog, isLoading: loadingLog } = useQuery({
    queryFn: ({ signal }) =>
      getData<RolProps[]>({
        url: 'rol/web',
        signal,
        query:
          `where.clientId=${profileCleaner?.id}&&where.status=inProgress` +
          '&&include.products.include.status=true',
      }),
    queryKey: ['rol-cleaner-get', profileCleaner?.id],
  })

  const { handleSubmit, setValue, control } = useForm<
    FilterRecordProps,
    'filter'
  >()

  const search = ''

  const hasSearchFilter = Boolean('true')

  const filteredData = useMemo(() => {
    if (!dataLog?.length) return []
    let filteredData = [...dataLog]

    // if (hasSearchFilter) {
    //   filteredData = filteredData.filter((item) => {
    //     return String(item.user?.name)
    //       .toLowerCase()
    //       .includes(search.toLowerCase())
    //   })
    // }

    return filteredData
  }, [dataLog])

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
    console.log('selectedKeys', selectedKeys)
    cleanerMonitoringHook.setIsFilterOpen(false)
  }

  const loading = loadingLog

  return (
    <div className="flex w-full flex-col gap-4">
      {dataLog && (
        <Accordion
          selectionMode="multiple"
          aria-label="Logs"
          selectedKeys={selectedKeys ?? dataLog.map((item) => String(item.id))}
          onSelectionChange={setSelectedKeys as any}
        >
          {items?.map((item) => {
            const createdAt = format(
              new Date(item.createdAt),
              'dd/MM/yyyy HH:mm',
            )
            return (
              <AccordionItem
                key={String(item.id)}
                textValue={createdAt}
                aria-label={createdAt}
                title={
                  <div className="flex flex-col gap-2">
                    <span className="font-bold">Rol de {createdAt}</span>
                  </div>
                }
                classNames={{
                  base: 'rounded-md data-[open=true]:bg-content2 px-2',
                  content: 'px-4',
                }}
              >
                <>
                  <div className="">
                    <div className="flex flex-col gap-2">
                      {item.products?.map((product) => {
                        return (
                          <div
                            key={String(product.id)}
                            className="flex flex-col gap-2 rounded-md bg-content1 p-2"
                          >
                            <span className="font-bold">Nome: </span>
                            <span className="ml-2">{product.name}</span>
                            <span className="font-bold">Status: </span>
                            <span className="ml-2">{product.status?.name}</span>
                            <span className="font-bold">
                              Última atualização:{' '}
                            </span>
                            <span className="ml-2">
                              {format(
                                new Date(product.status?.updateAt ?? ''),
                                "dd/MM/yyyy HH:mm:ss's'",
                              )}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              </AccordionItem>
            )
          })}
        </Accordion>
      )}

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
        isOpen={cleanerMonitoringHook.isFilterOpen}
        backdrop="opaque"
        classNames={{
          backdrop: 'blur-md',
        }}
        onOpenChange={(open) => {
          cleanerMonitoringHook.setIsFilterOpen(open)
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
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        Data inicial
                        <Controller
                          name="dateStart"
                          control={control}
                          defaultValue={
                            new Date(cleanerMonitoringHook.dateStart)
                          }
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
                                      cleanerMonitoringHook.dateEnd &&
                                      new Date(cleanerMonitoringHook.dateEnd) <
                                        date
                                    ) {
                                      cleanerMonitoringHook.setDateEnd(
                                        date?.toISOString(),
                                      )
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
                          defaultValue={new Date(cleanerMonitoringHook.dateEnd)}
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

export default Logs
