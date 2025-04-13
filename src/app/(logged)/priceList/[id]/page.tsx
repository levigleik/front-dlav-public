'use client'

import { PostData, PutData } from '@/types'
import { ClientProps } from '@/types/client'
import {
  getData,
  postData,
  putData,
  toastErrorsApi,
} from '@/utils/functions.api'
import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  CheckboxGroup,
  cn,
  Input,
  Pagination,
  Skeleton,
} from '@nextui-org/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Row } from 'components/grid/row'
import { useParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import {
  PriceListDefaultProps,
  PriceListFormProps,
  PriceListFormSendProps,
} from './types'
import { toast } from 'react-toastify'
import { ProductDefaultProps } from '@/app/(logged)/product/[id]/types'
import { delay, groupBy } from '@/utils/functions'
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll'
import { reorderProductsAndGroups } from '@/app/(logged)/priceList/functions'
import { firstDeployClients } from '@/app/(logged)/client/constants'
import { Combobox } from 'components/ui/combobox'

const PriceListEdit = () => {
  const { id } = useParams<{ id: string | 'new' }>()

  const { data: dataGetPriceList, isLoading: loadingGet } = useQuery({
    queryFn: ({ signal }) =>
      getData<PriceListDefaultProps>({
        url: 'priceList',
        id: id === 'new' ? 1 : parseInt(id, 10),
        signal,
        query:
          'include.groups.include.products.include.group=true' +
          '&&include.client=true',
      }),
    queryKey: ['price-list-get', id],
    select: reorderProductsAndGroups,
  })

  const { data: dataGetPriceListDefault, isLoading: loadingGetDefault } =
    useQuery({
      queryFn: ({ signal }) =>
        getData<PriceListDefaultProps>({
          url: 'priceList',
          id: 1,
          signal,
          query:
            'include.groups.include.products.include.group=true' +
            '&&include.client=true',
        }),
      queryKey: ['price-list-default-get', id],
      enabled: id !== 'new',
      select: reorderProductsAndGroups,
    })

  const { mutateAsync: mutatePost, isPending: loadingPost } = useMutation({
    mutationFn: async (val: PostData<PriceListFormSendProps>) =>
      postData<PriceListDefaultProps, PriceListFormSendProps>(val),
    mutationKey: ['product-post'],
  })

  const { mutateAsync: mutatePut, isPending: loadingPut } = useMutation({
    mutationFn: (val: PutData<PriceListFormSendProps>) =>
      putData<PriceListDefaultProps, PriceListFormSendProps>(val),
    mutationKey: ['product-put'],
  })

  const { data: dataClient, isLoading: loadingClient } = useQuery({
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

  const { handleSubmit, setValue, control, reset, getValues } = useForm<
    PriceListFormProps,
    'priceList'
  >()

  useFieldArray({
    control,
    name: 'groups',
  })

  const [productsSelected, setProductsSelected] = useState<string[]>([])

  const onSubmit = (data: PriceListFormProps) => {
    let products
    if (id === 'new') {
      products =
        dataGetPriceList?.groups?.flatMap(
          (group) =>
            group.products?.filter((product) =>
              productsSelected.includes(String(product.name)),
            ) ?? [],
        ) ?? []
    } else {
      products =
        dataGetPriceListDefault?.groups?.flatMap(
          (group) =>
            group.products?.filter((product) =>
              productsSelected.includes(String(product.name)),
            ) ?? [],
        ) ?? []
    }

    const groupedProducts = groupBy(
      products,
      (product: ProductDefaultProps) => product.group?.name ?? '',
    )

    const parseData: PriceListFormSendProps = {
      ...data,
      clientIds: data.clientIds?.map((a) => Number(a)),
      groups: Object.keys(Object.fromEntries(groupedProducts)).map((key) => ({
        name: key,
        products: groupedProducts.get(key)?.map((product) => {
          // match the product by name in dataGetPriceListDefault
          const productDefault = dataGetPriceListDefault?.groups
            ?.flatMap((group) => group.products ?? [])
            .find((item) => item.name === product.name)
          let priceMatch
          if (id !== 'new')
            priceMatch = getValues(
              `groups.${productDefault?.group?.id ?? 0}.products.${
                productDefault?.id ?? 0
              }.price`,
            )
          else
            priceMatch = getValues(
              `groups.${product.group?.id ?? 0}.products.${product.id}.price`,
            )
          return {
            ...product,
            id: undefined,
            price: Number(priceMatch ?? product.price) ?? 0,
            height: Number(product.height) ?? 0,
            width: Number(product.width) ?? 0,
            diameter: Number(product.diameter) ?? 0,
            defects: undefined,
            hairHeights: undefined,
            backgrounds: undefined,
            edges: undefined,
            stamps: undefined,
            colors: undefined,
            photos: !!product.photos?.length ? product.photos : undefined,
            group: undefined,
          }
        }),
      })),
    }

    if (id === 'new')
      mutatePost({
        url: '/priceList',
        data: parseData,
      })
        .then(() => {
          toast.success('Tabela de preço cadastrada com sucesso')
          reset()
          setProductsSelected([])
        })
        .catch((error: any) => {
          toastErrorsApi(error)
        })
    else
      mutatePut({
        url: '/priceList',
        data: parseData,
        id: parseInt(id, 10),
      })
        .then(() => {
          toast.success(`Tabela de preço atualizada com sucesso.`)
        })
        .catch((err) => {
          toastErrorsApi(err)
        })
  }

  const [loadingClientPagination, setLoadingClientPagination] = useState(false)

  const loading =
    loadingGet ||
    loadingPost ||
    loadingPut ||
    loadingClient ||
    loadingClientPagination ||
    loadingGetDefault

  const [isOpen, setIsOpen] = useState(false)

  const [page, setPage] = useState(1)
  //
  // const [clientSearch, setClientSearch] = useState<string>('')
  //
  // const [clientSelected, setClientSelected] = useState<string | null>('')

  const rowsPerPage = 30

  const pages = Math.ceil((dataClient?.length ?? 0) / rowsPerPage)

  // const filteredClient = useMemo(() => {
  //   if (!dataClient?.length) return []
  //   let filteredData = [...dataClient]
  //
  //   if (clientSearch) {
  //     filteredData = filteredData.filter((item) =>
  //       String(item.fantasyName)
  //         .toLowerCase()
  //         .includes(clientSearch.toLowerCase()),
  //     )
  //   }
  //
  //   return filteredData
  // }, [clientSearch, dataClient])

  // const clients = useMemo(() => {
  //   const start = (page - 1) * rowsPerPage
  //   const end = start + rowsPerPage
  //
  //   return filteredClient?.slice(0, end)
  // }, [page, filteredClient, rowsPerPage])

  const onLoadMore = async () => {
    setLoadingClientPagination(true)
    await delay(500)
    setPage((prevState) => prevState + 1)
    setLoadingClientPagination(false)
  }

  const hasMore = useMemo(() => {
    return page < pages
  }, [page, pages])

  const [, scrollerRef] = useInfiniteScroll({
    hasMore,
    isEnabled: isOpen,
    shouldUseLoader: false,
    onLoadMore,
  })

  useEffect(() => {
    if (dataGetPriceList) {
      // console.log(dataGetPriceList)
      if (id !== 'new') {
        setValue('name', dataGetPriceList.name)
        // setClientSelected(String(dataGetPriceList.clientId))
        // setClientSearch(String(dataGetPriceList.client?.fantasyName ?? ''))
        setProductsSelected(
          dataGetPriceList.groups
            ?.flatMap(
              (group) =>
                group.products?.map((product) => product.name.toString()) ?? [],
            )
            .filter((item) => !!item) as string[],
        )
        // set the price of products based on dataGetPriceList
        dataGetPriceListDefault?.groups?.forEach((groupDefault) => {
          groupDefault.products?.forEach((productDefault) => {
            const product = dataGetPriceList?.groups
              ?.flatMap((group) => group.products ?? [])
              .find((product) => product.name === productDefault.name)
            if (product)
              setValue(
                `groups.${groupDefault.id}.products.${productDefault.id}.price`,
                String(product?.price),
              )
          })
        })
      }
    }
  }, [dataGetPriceList, dataGetPriceListDefault, id, setValue])

  // create a pagination in products
  // create a pagination in groups
  const [currentPage, setCurrentPage] = useState<Record<number, number>>()

  const itemsPerPage = 10

  // ...

  const handlePageChange = (groupId: number, pageNumber: number) => {
    setCurrentPage((prevState) => ({ ...prevState, [groupId]: pageNumber }))
  }

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <Row>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: 'Campo obrigatório' }}
          render={({ field, fieldState: { error } }) => (
            <Skeleton className="rounded-md" isLoaded={!loading}>
              <Input
                label="Nome"
                id={field.name}
                type="text"
                onChange={field.onChange}
                name={field.name}
                value={field.value}
                variant="bordered"
                color="primary"
                isRequired
                isInvalid={!!error}
                errorMessage={error?.message}
              />
            </Skeleton>
          )}
        />
        {id === 'new' && (
          <Controller
            name="clientIds"
            control={control}
            // defaultValue={dataClient?.map((a) => a.id.toString())}
            render={({ field, fieldState: { error } }) => (
              <Skeleton className="rounded-md" isLoaded={!loading}>
                <Combobox
                  data={dataClient ?? []}
                  value={field.value}
                  onChange={field.onChange}
                  id={field.name}
                  label="Clientes"
                  filterKey={['fantasyName']}
                  textValueKey="fantasyName"
                  isRequired
                  isMultiple
                  itemRenderer={(item) => (
                    <div className="flex flex-col gap-2">
                      <span className="font-bold">{item.fantasyName}</span>
                      <small className="text-tiny text-default-400">
                        {item?.corporateName ?? ''}
                      </small>
                    </div>
                  )}
                />
              </Skeleton>
            )}
          />
        )}
      </Row>
      {id !== 'new' && (
        <div className="flex flex-col">
          {dataGetPriceListDefault?.groups?.length && (
            <Accordion selectionMode="multiple">
              {dataGetPriceListDefault?.groups?.map((group) => (
                <AccordionItem
                  key={group.id}
                  aria-label={group.name}
                  title={group.name}
                  classNames={{
                    base: 'w-full md:w-[50%]',
                    content: 'overflow-hidden',
                  }}
                  isDisabled={loading}
                >
                  <Button
                    color="primary"
                    variant="flat"
                    onClick={() => {
                      if (
                        productsSelected.some(
                          (item) =>
                            group.products?.some(
                              (product) => String(product.name) === item,
                            ),
                        )
                      )
                        setProductsSelected(
                          productsSelected.filter(
                            (item) =>
                              !group.products?.some(
                                (product) => String(product.name) === item,
                              ),
                          ),
                        )
                      else
                        setProductsSelected([
                          ...productsSelected,
                          ...(group.products?.map((product) =>
                            String(product.name),
                          ) ?? []),
                        ])
                    }}
                    className="my-4 w-fit"
                  >
                    Selecionar todos
                  </Button>
                  <CheckboxGroup
                    value={productsSelected}
                    onValueChange={(nameProduct) => {
                      setProductsSelected(nameProduct as string[])
                    }}
                  >
                    {group.products
                      ?.slice(
                        ((currentPage?.[group.id] || 1) - 1) * itemsPerPage,
                        (currentPage?.[group.id] || 1) * itemsPerPage,
                      )
                      .map((product) => (
                        <div
                          key={product.id}
                          className={cn(
                            'flex justify-between gap-2',
                            'flex-wrap rounded-md bg-content1 p-2',
                          )}
                        >
                          <Checkbox
                            color="primary"
                            className="text-sm"
                            value={String(product.name)}
                          >
                            {product.name}
                          </Checkbox>
                          <Controller
                            name={`groups.${group.id}.products.${product.id}.price`}
                            control={control}
                            defaultValue={String(product.price ?? 0)}
                            render={({ field, fieldState: { error } }) => (
                              <Skeleton
                                className="rounded-md"
                                isLoaded={!loading}
                              >
                                <Input
                                  label="Preço"
                                  type="number"
                                  startContent={
                                    <div className="pointer-events-none flex items-center">
                                      <span className="text-small text-default-400">
                                        R$
                                      </span>
                                    </div>
                                  }
                                  value={field.value}
                                  className="w-fit"
                                  onChange={(e) => {
                                    // auto check the current product if value is changed
                                    if (
                                      !productsSelected.includes(
                                        String(product.name),
                                      )
                                    ) {
                                      const productsTemp = [
                                        ...productsSelected,
                                        String(product.name),
                                      ]
                                      setProductsSelected(productsTemp)
                                    }
                                    field.onChange(e)
                                  }}
                                  name={field.name}
                                  isInvalid={!!error}
                                  errorMessage={error?.message}
                                />
                              </Skeleton>
                            )}
                          />
                        </div>
                      ))}
                  </CheckboxGroup>
                  <Pagination
                    total={Math.ceil(
                      (group.products?.length || 0) / itemsPerPage,
                    )}
                    page={currentPage?.[group.id] || 1}
                    onChange={(pageNumber) =>
                      handlePageChange(group.id, pageNumber)
                    }
                    className="my-4"
                  />
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      )}
      {id === 'new' && (
        <div className="flex flex-col">
          {dataGetPriceList?.groups?.length && (
            <Accordion selectionMode="multiple">
              {dataGetPriceList?.groups?.map((group) => (
                <AccordionItem
                  key={group.id}
                  aria-label={group.name}
                  title={group.name}
                  classNames={{
                    base: 'w-full md:w-[50%]',
                    content: 'overflow-hidden',
                  }}
                  isDisabled={loading}
                >
                  <Button
                    color="primary"
                    variant="flat"
                    onClick={() => {
                      if (
                        productsSelected.some(
                          (item) =>
                            group.products?.some(
                              (product) => String(product.name) === item,
                            ),
                        )
                      )
                        setProductsSelected(
                          productsSelected.filter(
                            (item) =>
                              !group.products?.some(
                                (product) => String(product.name) === item,
                              ),
                          ),
                        )
                      else
                        setProductsSelected([
                          ...productsSelected,
                          ...(group.products?.map((product) =>
                            String(product.name),
                          ) ?? []),
                        ])
                    }}
                    className="my-4 w-fit"
                  >
                    Selecionar todos
                  </Button>
                  <CheckboxGroup
                    value={productsSelected}
                    onValueChange={(idProduct) => {
                      setProductsSelected(idProduct as string[])
                    }}
                  >
                    {group.products
                      ?.slice(
                        ((currentPage?.[group.id] || 1) - 1) * itemsPerPage,
                        (currentPage?.[group.id] || 1) * itemsPerPage,
                      )
                      .map((product) => (
                        <div
                          key={product.id}
                          className={cn(
                            'flex justify-between gap-2',
                            'flex-wrap rounded-md bg-content1 p-2',
                          )}
                        >
                          <Checkbox
                            color="primary"
                            className="text-sm"
                            value={String(product.name)}
                          >
                            {product.name}
                          </Checkbox>
                          <Controller
                            name={`groups.${group.id}.products.${product.id}.price`}
                            control={control}
                            defaultValue={String(product.price ?? 0)}
                            render={({ field, fieldState: { error } }) => (
                              <Skeleton
                                className="rounded-md"
                                isLoaded={!loading}
                              >
                                <Input
                                  label="Preço"
                                  type="number"
                                  startContent={
                                    <div className="pointer-events-none flex items-center">
                                      <span className="text-small text-default-400">
                                        R$
                                      </span>
                                    </div>
                                  }
                                  value={field.value}
                                  className="w-fit"
                                  onChange={(e) => {
                                    // auto check the current product if value is changed
                                    if (
                                      !productsSelected.includes(
                                        String(product.name),
                                      )
                                    ) {
                                      const productsTemp = [
                                        ...productsSelected,
                                        String(product.name),
                                      ]
                                      setProductsSelected(productsTemp)
                                    }
                                    field.onChange(e)
                                  }}
                                  name={field.name}
                                  isInvalid={!!error}
                                  errorMessage={error?.message}
                                />
                              </Skeleton>
                            )}
                          />
                        </div>
                      ))}
                  </CheckboxGroup>
                  <Pagination
                    total={Math.ceil(
                      (group.products?.length || 0) / itemsPerPage,
                    )}
                    page={currentPage?.[group.id] || 1}
                    onChange={(pageNumber) =>
                      handlePageChange(group.id, pageNumber)
                    }
                    className="my-4"
                  />
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      )}

      <Button
        type="submit"
        variant="flat"
        color="primary"
        className="w-fit"
        isDisabled={loading}
      >
        Salvar
      </Button>
    </form>
  )
}

export default PriceListEdit
