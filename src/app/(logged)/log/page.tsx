'use client'
import { ClientProps } from '@/types/client'
import { getData } from '@/utils/functions.api'
import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
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
  Select,
  SelectItem,
  Skeleton,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useMemo, useState } from 'react'

import { firstDeployClients } from '@/app/(logged)/client/constants'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { Calendar } from 'components/ui/calendar'
import { ptBR } from 'date-fns/locale'
import { FilterRecordProps } from '@/app/(logged)/record/types'
import { LogsProps } from '@/types/logs'
import { useLogHook } from '@/app/(logged)/log/hooks'
import { AdditionalProps } from '@/types/product'
import { ProductRolProps } from '@/types/productRol'
import { DefectProps } from '@/types/defect'
import Image from 'next/image'
import { LocationProps, RolProps } from '@/types/rol'
import { formatBRL } from '@/utils/functions'

const Logs = () => {
  const router = useRouter()

  const logHook = useLogHook()

  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  const { data: dataLog, isLoading: loadingLog } = useQuery({
    queryFn: ({ signal }) =>
      getData<LogsProps[]>({
        url: 'log',
        signal,
        query:
          `where.createdAt.gte=${logHook.dateStart}` +
          `&&where.createdAt.lte=${logHook.dateEnd}`,
      }),
    queryKey: ['log-get', logHook],
  })

  const { data: dataGetClients, isLoading: loadingGetClient } = useQuery({
    queryFn: ({ signal }) =>
      getData<ClientProps[]>({
        url: 'client',
        signal,
        query: 'include.address=true',
      }),
    queryKey: ['client-get'],
    // select: (data) => {
    //   const parseData = data?.filter((item) =>
    //     firstDeployClients.some((item2) =>
    //       item.fantasyName.toLowerCase().includes(item2.toLowerCase()),
    //     ),
    //   )
    //   // let filteredClients = parseData.filter((client) =>
    //   //   uniqueIdsFirstDeploy.includes(client.id),
    //   // )
    //   //
    //   // console.log(filteredClients)
    //   return parseData
    // },
  })

  const { handleSubmit, setValue, control } = useForm<
    FilterRecordProps,
    'filter'
  >()
  const dataClientIds = dataLog?.map((a) => a?.dataBeforeUpdate?.clientId)

  const dataClients = dataGetClients?.filter(
    (item) => dataClientIds?.includes(item?.id),
  )

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
    if (!dataLog?.length) return []
    let filteredData = [...dataLog]

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) => {
        const clientFind = dataGetClients?.find(
          (a) =>
            a.id ===
            (item.dataBeforeUpdate?.clientId ||
              a.id === item.dataAfterUpdate?.clientId),
        )

        return (
          String(item.user?.name)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          String(clientFind?.fantasyName)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          String(clientFind?.corporateName)
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      })
    }

    return filteredData
  }, [dataGetClients, dataLog, hasSearchFilter])

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
    // const tempRols = dataLog?.filter(
    //   (a) => data.rolIds?.includes(a.id.toString()),
    // )
    // if (!tempRols) {
    //   toast.error('Rol não encontrado')
    //   return
    // } else if (tempRols.length > 0) recordHook.setRols(tempRols)
    if (data.clientIds?.length) logHook.setClientIds(data.clientIds)
    if (data.dateEnd) logHook.setDateEnd(data.dateEnd?.toISOString())
    if (data.dateStart) logHook.setDateStart(data.dateStart?.toISOString())

    logHook.setIsFilterOpen(false)
  }

  function getChangedValues(
    productBefore: ProductRolProps<any>,
    product: ProductRolProps<any>,
    type: 'before' | 'after',
  ) {
    const keys = Object.keys(productBefore) as (keyof ProductRolProps<any>)[]
    const changedValues: React.JSX.Element[] = []

    keys.forEach((key) => {
      if (key === 'additionals') {
        // Handle 'additionals' key
        const beforeAdditionals = productBefore[key] as AdditionalProps[]
        const afterAdditionals = product[key] as AdditionalProps[]

        beforeAdditionals.forEach((beforeAdditional, index) => {
          const afterAdditional = afterAdditionals[index]

          if (
            JSON.stringify(beforeAdditional) !== JSON.stringify(afterAdditional)
          ) {
            const additionalKeys = Object.keys(
              beforeAdditional,
            ) as (keyof AdditionalProps)[]
            additionalKeys.forEach((additionalKey) => {
              if (
                beforeAdditional[additionalKey] !==
                afterAdditional[additionalKey]
              ) {
                const value =
                  type === 'before'
                    ? beforeAdditional[additionalKey]
                    : afterAdditional[additionalKey]
                changedValues.push(
                  <span className="" key={`${key}.${String(additionalKey)}`}>
                    {`${key} ${String(additionalKey)}`}: {value || '-'}
                  </span>,
                )
              }
            })
          }
        })
      } else if (
        key === 'defects' ||
        key === 'hairHeights' ||
        key === 'colors' ||
        key === 'edges' ||
        key === 'stamps' ||
        key === 'backgrounds'
      ) {
        // Handle 'defect' key
        const beforeDefects = productBefore[key] as DefectProps<any>[]
        const afterDefects = product[key] as DefectProps<any>[]

        beforeDefects.forEach((beforeDefect, index) => {
          const afterDefect = afterDefects[index]

          if (JSON.stringify(beforeDefect) !== JSON.stringify(afterDefect)) {
            const defectKeys = Object.keys(
              beforeDefect,
            ) as (keyof DefectProps<any>)[]
            defectKeys.forEach((defectKey) => {
              if (beforeDefect?.[defectKey] !== afterDefect?.[defectKey]) {
                const value =
                  type === 'before'
                    ? beforeDefect?.[defectKey]
                    : afterDefect?.[defectKey]

                let keyTranslated = key as string
                switch (key) {
                  case 'defects':
                    keyTranslated = 'Defeito'
                    break
                  case 'hairHeights':
                    keyTranslated = 'Altura do pelo'
                    break
                  case 'colors':
                    keyTranslated = 'Cor'
                    break
                  case 'edges':
                    keyTranslated = 'Borda'
                    break
                  case 'stamps':
                    keyTranslated = 'Estampa'
                    break
                  case 'backgrounds':
                    keyTranslated = 'Fundo'
                    break
                }
                changedValues.push(
                  <span className="" key={`${key}.${String(defectKey)}`}>
                    {`${keyTranslated} ${String(defectKey)}`}: {value || '-'}
                  </span>,
                )
              }
            })
          }
        })
      } else if (key === 'photos') {
        // Handle 'photos' key
        const beforePhotos = productBefore[key] as string[]
        const afterPhotos = product[key] as string[]

        beforePhotos.forEach((beforePhoto, index) => {
          const afterPhoto = afterPhotos[index]

          if (beforePhoto !== afterPhoto) {
            const value = type === 'before' ? beforePhoto : afterPhoto
            changedValues.push(
              <span className="" key={`${key}.${index}`}>
                <Image src={value} alt="Foto" width={50} height={50} />
              </span>,
            )
          }
        })
      } else if (key !== 'id' && key !== 'createdAt' && key !== 'updateAt') {
        // Handle all other keys
        if (productBefore[key] !== product[key]) {
          const value = type === 'before' ? productBefore[key] : product[key]
          let keyTranslated = key as string
          switch (key) {
            case 'name':
              keyTranslated = 'Nome'
              break
            case 'price':
              keyTranslated = 'Preço'
              break
            case 'description':
              keyTranslated = 'Descrição'
              break
            case 'group':
              keyTranslated = 'Grupo'
              break
            case 'type':
              keyTranslated = 'Tipo'
              break
            case 'status':
              keyTranslated = 'Status'
              break
            case 'quantity':
              keyTranslated = 'Quantidade'
              break
            case 'height':
              keyTranslated = 'Altura'
              break
            case 'color':
              keyTranslated = 'Cor'
              break
            case 'width':
              keyTranslated = 'Largura'
              break
            case 'diameter':
              keyTranslated = 'Diâmetro'
              break
            case 'hairHeight':
              keyTranslated = 'Altura do pelo'
              break
            case 'edge':
              keyTranslated = 'Borda'
              break
            case 'stamp':
              keyTranslated = 'Estampa'
              break
            case 'background':
              keyTranslated = 'Fundo'
              break
            case 'observation':
              keyTranslated = 'Observação'
              break
            case 'identification':
              keyTranslated = 'Identificação'
              break
          }
          changedValues.push(
            <span className="" key={key as string}>
              {keyTranslated}: {value || '-'}
            </span>,
          )
        }
      }
    })

    return changedValues
  }

  const loading = loadingGetClient || loadingLog

  return (
    <div className="flex w-full flex-col gap-4">
      {dataGetClients && (
        <Accordion
          selectionMode="multiple"
          aria-label="Logs"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys as any}
        >
          {items?.map((item) => {
            const clientFind = dataGetClients?.find(
              (a) => a.id === item?.dataBeforeUpdate?.clientId,
            )
            if (!clientFind)
              return (
                <AccordionItem
                  key={String(item.id)}
                  textValue={String(item.id)}
                  aria-label={String(item.id)}
                  title={
                    <div className="flex flex-col gap-2">
                      <span className="font-bold">
                        Rol {item?.dataBeforeUpdate?.id}
                      </span>
                    </div>
                  }
                >
                  <>
                    <div className="ml-[10px] ">
                      <div className="flex justify-between">
                        <div className="flex flex-grow flex-col">
                          <span className="mb-1 text-2xl font-bold">Antes</span>
                          {Object.entries(item.updatedFields).map(
                            ([key, value]) => {
                              const productsBeforeString = JSON.stringify(
                                item.dataBeforeUpdate.products.map((a) => ({
                                  ...a,
                                  id: undefined,
                                  createdAt: undefined,
                                  updateAt: undefined,
                                })),
                              )

                              const productsAfterString = JSON.stringify(
                                item.dataAfterUpdate.products.map((a) => ({
                                  ...a,
                                  id: undefined,
                                  createdAt: undefined,
                                  updateAt: undefined,
                                })),
                              )
                              if (
                                key === 'products' &&
                                productsBeforeString !== productsAfterString
                              ) {
                                return (
                                  <div
                                    key="products"
                                    className="flex flex-col gap-4"
                                  >
                                    <span className="ml-1 font-semibold">
                                      Produtos
                                    </span>
                                    <div className="flex flex-grow flex-col">
                                      {(value as ProductRolProps<any>[])?.map(
                                        (product) => {
                                          const productBefore =
                                            item.dataBeforeUpdate.products.find(
                                              (a) => a.name === product.name,
                                            )
                                          const productAfter =
                                            item.dataAfterUpdate.products.find(
                                              (a) => a.name === product.name,
                                            )
                                          if (!productBefore) return <></>
                                          if (!productAfter) return <></>

                                          return (
                                            <div
                                              key={
                                                productBefore.name +
                                                Math.random()
                                              }
                                              className="ml-[10px] flex flex-col"
                                            >
                                              {getChangedValues(
                                                productBefore,
                                                productAfter,
                                                'before',
                                              ) || '-'}
                                            </div>
                                          )
                                        },
                                      )}
                                    </div>
                                  </div>
                                )
                              }
                              return (
                                <div key={key} className="ml-[10px] ">
                                  <div className="flex justify-between">
                                    <div className="flex flex-grow flex-col">
                                      <span className="ml-2 font-bold">
                                        {key}:{' '}
                                        {JSON.stringify(
                                          item.dataBeforeUpdate[
                                            key as keyof RolProps
                                          ],
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            },
                          )}
                        </div>
                        <div className="flex flex-grow flex-col">
                          <span className="mb-1 text-2xl font-bold">
                            Depois
                          </span>
                          {Object.entries(item.updatedFields).map(
                            ([key, value]) => {
                              const productsBeforeString = JSON.stringify(
                                item.dataBeforeUpdate.products.map((a) => ({
                                  ...a,
                                  id: undefined,
                                  createdAt: undefined,
                                  updateAt: undefined,
                                })),
                              )

                              const productsAfterString = JSON.stringify(
                                item.dataAfterUpdate.products.map((a) => ({
                                  ...a,
                                  id: undefined,
                                  createdAt: undefined,
                                  updateAt: undefined,
                                })),
                              )
                              if (
                                key === 'products' &&
                                productsBeforeString !== productsAfterString
                              ) {
                                return (
                                  <div
                                    key="products"
                                    className="flex flex-col gap-4"
                                  >
                                    <span className="ml-1 font-semibold">
                                      Produtos
                                    </span>
                                    <div className="flex flex-grow flex-col">
                                      {(value as ProductRolProps<any>[])?.map(
                                        (product) => {
                                          const productBefore =
                                            item.dataBeforeUpdate.products.find(
                                              (a) => a.name === product.name,
                                            )
                                          const productAfter =
                                            item.dataAfterUpdate.products.find(
                                              (a) => a.name === product.name,
                                            )
                                          if (!productBefore) return <></>
                                          if (!productAfter) return <></>

                                          return (
                                            <div
                                              key={
                                                productBefore.name +
                                                Math.random()
                                              }
                                              className="ml-[10px] flex flex-col"
                                            >
                                              {getChangedValues(
                                                productBefore,
                                                productAfter,
                                                'after',
                                              ) || '-'}
                                            </div>
                                          )
                                        },
                                      )}
                                    </div>
                                  </div>
                                )
                              }
                              return (
                                <div key={key} className="ml-[10px] ">
                                  <div className="flex justify-between">
                                    <div className="flex flex-grow flex-col">
                                      <span className="ml-2 font-bold">
                                        {key}:{' '}
                                        {JSON.stringify(
                                          item.dataAfterUpdate[
                                            key as keyof RolProps
                                          ],
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            },
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                </AccordionItem>
              )
            return (
              <AccordionItem
                key={String(item.id)}
                textValue={String(item.id)}
                aria-label={String(item.id)}
                title={
                  <div className="flex flex-col gap-2">
                    <span className="font-bold">
                      {clientFind?.fantasyName ?? clientFind?.corporateName} -
                      Rol {item?.dataBeforeUpdate?.id}
                    </span>
                  </div>
                }
              >
                <>
                  <div className="ml-[10px] ">
                    <div className="flex justify-between">
                      <div className="flex flex-grow flex-col">
                        <span className="mb-1 text-2xl font-bold">Antes</span>
                        {Object.entries(item.updatedFields).map(
                          ([key, value]) => {
                            const productsBeforeString = JSON.stringify(
                              item.dataBeforeUpdate.products.map((a) => ({
                                ...a,
                                id: undefined,
                                createdAt: undefined,
                                updateAt: undefined,
                              })),
                            )

                            const productsAfterString = JSON.stringify(
                              item.dataAfterUpdate.products.map((a) => ({
                                ...a,
                                id: undefined,
                                createdAt: undefined,
                                updateAt: undefined,
                              })),
                            )
                            if (
                              key === 'products' &&
                              productsBeforeString !== productsAfterString
                            ) {
                              return (
                                <div
                                  key="products"
                                  className="flex flex-col gap-4"
                                >
                                  <span className="ml-1 font-semibold">
                                    Produtos
                                  </span>
                                  <div className="flex flex-grow flex-col">
                                    {(value as ProductRolProps<any>[])?.map(
                                      (product) => {
                                        const productBefore =
                                          item.dataBeforeUpdate.products.find(
                                            (a) => a.name === product.name,
                                          )
                                        const productAfter =
                                          item.dataAfterUpdate.products.find(
                                            (a) => a.name === product.name,
                                          )
                                        if (!productBefore) return <></>
                                        if (!productAfter) return <></>

                                        return (
                                          <div
                                            key={
                                              productBefore.name + Math.random()
                                            }
                                            className="ml-[10px] flex flex-col"
                                          >
                                            {getChangedValues(
                                              productBefore,
                                              productAfter,
                                              'before',
                                            ) || '-'}
                                          </div>
                                        )
                                      },
                                    )}
                                  </div>
                                </div>
                              )
                            }
                            if (key === 'total') {
                              return (
                                <div key={key} className="ml-[10px] ">
                                  <div className="flex justify-between">
                                    <div className="flex flex-grow flex-col">
                                      <span className="ml-2 font-bold">
                                        Total do ROL:{' '}
                                        {formatBRL.format(
                                          Number(
                                            item.dataBeforeUpdate[
                                              'total' as keyof RolProps
                                            ] as string,
                                          ),
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            if (key === 'startLocation') {
                              return (
                                <div key={key} className="ml-[10px] ">
                                  <div className="flex justify-between">
                                    <div className="flex flex-grow flex-col">
                                      <span className="ml-2 font-bold">
                                        Localização inicial:{' '}
                                        <div className="flex flex-col gap-3">
                                          <span className="ml-2 text-sm">
                                            Latitude:{' '}
                                            {
                                              (
                                                item.dataBeforeUpdate[
                                                  'startLocation' as keyof RolProps
                                                ] as LocationProps | undefined
                                              )?.latitude
                                            }
                                          </span>
                                          <span className="ml-2 text-sm">
                                            Longitude:{' '}
                                            {
                                              (
                                                item.dataBeforeUpdate[
                                                  'startLocation' as keyof RolProps
                                                ] as LocationProps | undefined
                                              )?.longitude
                                            }
                                          </span>
                                        </div>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            if (key === 'startSubscriberName') {
                              return (
                                <div key={key} className="ml-[10px] ">
                                  <div className="flex justify-between">
                                    <div className="flex flex-grow flex-col">
                                      <span className="ml-2 font-bold">
                                        Nome do assinante:{' '}
                                        {(item.dataBeforeUpdate[
                                          'startSubscriberName' as keyof RolProps
                                        ] as string | null) || '-'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            if (key === 'launchSignature') {
                              return (
                                <div key={key} className="ml-[10px] ">
                                  <div className="flex justify-between">
                                    <div className="flex flex-grow flex-col">
                                      <span className="ml-2 font-bold">
                                        Assinatura:{' '}
                                        {(item.dataBeforeUpdate[
                                          'launchSignature' as keyof RolProps
                                        ] as string) && (
                                          <div className={'w-fit bg-white'}>
                                            <Image
                                              src={
                                                (item.dataBeforeUpdate[
                                                  'launchSignature' as keyof RolProps
                                                ] as string) ?? ''
                                              }
                                              alt="Assinatura"
                                              width={150}
                                              height={150}
                                            />
                                          </div>
                                        )}
                                        {!(item.dataBeforeUpdate[
                                          'launchSignature' as keyof RolProps
                                        ] as string) && '-'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            if (key === 'startSubscriberPhone') {
                              return (
                                <div key={key} className="ml-[10px] ">
                                  <div className="flex justify-between">
                                    <div className="flex flex-grow flex-col">
                                      <span className="ml-2 font-bold">
                                        Telefone do assinante:{' '}
                                        {(item.dataBeforeUpdate[
                                          'startSubscriberPhone' as keyof RolProps
                                        ] as string | null) || '-'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return (
                              <div key={key} className="ml-[10px] ">
                                <div className="flex justify-between">
                                  <div className="flex flex-grow flex-col">
                                    <span className="ml-2 font-bold">
                                      {key}:{' '}
                                      {JSON.stringify(
                                        item.dataBeforeUpdate[
                                          key as keyof RolProps
                                        ],
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          },
                        )}
                      </div>
                      <div className="flex flex-grow flex-col">
                        <span className="mb-1 text-2xl font-bold">Depois</span>
                        {Object.entries(item.updatedFields).map(
                          ([key, value]) => {
                            const productsBeforeString = JSON.stringify(
                              item.dataBeforeUpdate.products.map((a) => ({
                                ...a,
                                id: undefined,
                                createdAt: undefined,
                                updateAt: undefined,
                              })),
                            )

                            const productsAfterString = JSON.stringify(
                              item.dataAfterUpdate.products.map((a) => ({
                                ...a,
                                id: undefined,
                                createdAt: undefined,
                                updateAt: undefined,
                              })),
                            )
                            if (
                              key === 'products' &&
                              productsBeforeString !== productsAfterString
                            ) {
                              return (
                                <div
                                  key="products"
                                  className="flex flex-col gap-4"
                                >
                                  <span className="ml-1 font-semibold">
                                    Produtos
                                  </span>
                                  <div className="flex flex-grow flex-col">
                                    {(value as ProductRolProps<any>[])?.map(
                                      (product) => {
                                        const productBefore =
                                          item.dataBeforeUpdate.products.find(
                                            (a) => a.name === product.name,
                                          )
                                        const productAfter =
                                          item.dataAfterUpdate.products.find(
                                            (a) => a.name === product.name,
                                          )
                                        if (!productBefore) return <></>
                                        if (!productAfter) return <></>

                                        return (
                                          <div
                                            key={
                                              productBefore.name + Math.random()
                                            }
                                            className="ml-[10px] flex flex-col"
                                          >
                                            {getChangedValues(
                                              productBefore,
                                              productAfter,
                                              'after',
                                            ) || '-'}
                                          </div>
                                        )
                                      },
                                    )}
                                  </div>
                                </div>
                              )
                            }
                            if (key === 'total') {
                              return (
                                <div key={key} className="ml-[10px] ">
                                  <div className="flex justify-between">
                                    <div className="flex flex-grow flex-col">
                                      <span className="ml-2 font-bold">
                                        Total do ROL:{' '}
                                        {formatBRL.format(
                                          Number(
                                            item.dataAfterUpdate[
                                              'total' as keyof RolProps
                                            ] as string,
                                          ),
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            if (key === 'startLocation') {
                              return (
                                <div key={key} className="ml-[10px] ">
                                  <div className="flex justify-between">
                                    <div className="flex flex-grow flex-col">
                                      <span className="ml-2 font-bold">
                                        Localização inicial:{' '}
                                        <div className="flex flex-col gap-3">
                                          <span className="ml-2 text-sm">
                                            Latitude:{' '}
                                            {
                                              (
                                                item.dataAfterUpdate[
                                                  'startLocation' as keyof RolProps
                                                ] as LocationProps | undefined
                                              )?.latitude
                                            }
                                          </span>
                                          <span className="ml-2 text-sm">
                                            Longitude:{' '}
                                            {
                                              (
                                                item.dataAfterUpdate[
                                                  'startLocation' as keyof RolProps
                                                ] as LocationProps | undefined
                                              )?.longitude
                                            }
                                          </span>
                                        </div>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            if (key === 'startSubscriberName') {
                              return (
                                <div key={key} className="ml-[10px] ">
                                  <div className="flex justify-between">
                                    <div className="flex flex-grow flex-col">
                                      <span className="ml-2 font-bold">
                                        Nome do assinante:{' '}
                                        {(item.dataAfterUpdate[
                                          'startSubscriberName' as keyof RolProps
                                        ] as string | null) || '-'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            if (key === 'launchSignature') {
                              return (
                                <div key={key} className="ml-[10px] ">
                                  <div className="flex justify-between">
                                    <div className="flex flex-grow flex-col">
                                      <span className="ml-2 font-bold">
                                        Assinatura:{' '}
                                        {(item.dataBeforeUpdate[
                                          'launchSignature' as keyof RolProps
                                        ] as string) && (
                                          <div className={'w-fit bg-white'}>
                                            <Image
                                              src={
                                                (item.dataBeforeUpdate[
                                                  'launchSignature' as keyof RolProps
                                                ] as string) ?? ''
                                              }
                                              alt="Assinatura"
                                              width={150}
                                              height={150}
                                            />
                                          </div>
                                        )}
                                        {!(item.dataBeforeUpdate[
                                          'launchSignature' as keyof RolProps
                                        ] as string) && '-'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            if (key === 'startSubscriberPhone') {
                              return (
                                <div key={key} className="ml-[10px] ">
                                  <div className="flex justify-between">
                                    <div className="flex flex-grow flex-col">
                                      <span className="ml-2 font-bold">
                                        Telefone do assinante:{' '}
                                        {(item.dataAfterUpdate[
                                          'startSubscriberPhone' as keyof RolProps
                                        ] as string | null) || '-'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return (
                              <div key={key} className="ml-[10px] ">
                                <div className="flex justify-between">
                                  <div className="flex flex-grow flex-col">
                                    <span className="ml-2 font-bold">
                                      {key}:{' '}
                                      {JSON.stringify(
                                        item.dataAfterUpdate[
                                          key as keyof RolProps
                                        ],
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          },
                        )}
                      </div>
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
        isOpen={logHook.isFilterOpen}
        backdrop="opaque"
        classNames={{
          backdrop: 'blur-md',
        }}
        onOpenChange={(open) => {
          logHook.setIsFilterOpen(open)
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
                    {clientsUnique && (
                      <Controller
                        name="clientIds"
                        control={control}
                        // defaultValue={dataClient?.map((a) => a.id.toString())}
                        render={({ field, fieldState: { error } }) => (
                          <Skeleton
                            className="rounded-md"
                            isLoaded={!loadingLog}
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
                              isLoading={loadingLog}
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
                          defaultValue={new Date(logHook.dateStart)}
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
                                      logHook.dateEnd &&
                                      new Date(logHook.dateEnd) < date
                                    ) {
                                      logHook.setDateEnd(date?.toISOString())
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
                          defaultValue={new Date(logHook.dateEnd)}
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
