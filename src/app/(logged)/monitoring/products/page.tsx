'use client'

import React, { useEffect, useState } from 'react'
import ContainerProductRol from './container'
import CardProductRol from './card'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getData, putData, toastErrorsApi } from '@/utils/functions.api'
import { RolProps } from '@/types/rol'
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Skeleton,
} from '@nextui-org/react'
import { useMonitoringProductHook } from './hooks'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import {
  FilterMonitoringProps,
  ProductStatusModalFormProps,
} from '@/app/(logged)/monitoring/rols/types'
import { ProductRolProps } from '@/types/productRol'
import { ProductStatusProps } from '@/types/productStatus'
import { PutData } from '@/types'
import Loading from 'components/loading'
import Empty from '@/app/(logged)/monitoring/rols/empty'
import { Combobox } from 'components/ui/combobox'
import { ClientProps } from '@/types/client'

export default function Monitoring() {
  const {
    isFilterOpen,
    setIsFilterOpen,
    rols,
    setRols,
    orderBy,
    setIsProductModalOpen,
    idProductModalOpen,
    isProductModalOpen,
    clientIds,
    setClientIds,
  } = useMonitoringProductHook()

  const { data: dataRol, isLoading: loadingRol } = useQuery({
    queryFn: ({ signal }) =>
      getData<RolProps[]>({
        url: 'rol',
        signal,
        query: 'include.client=true&&include.products.include.status',
      }),
    queryKey: ['rol-get'],
  })

  const {
    data: dataProductRol,
    isLoading: loadingProductRol,
    refetch,
  } = useQuery({
    queryFn: ({ signal }) =>
      getData<ProductRolProps<RolProps>[]>({
        url: 'productRol',
        signal,
        query:
          'include.rol.include.client=true&&' +
          'where.rol.status=inProgress&&' +
          `include.status${
            rols ? `&&where.rolId.in=[${rols?.map((a) => a.id)}]` : ''
          }${clientIds ? `&&where.rol.client.id.in=[${clientIds}]` : ''}`,
      }),
    queryKey: ['product-rol-get', rols, clientIds],
    select: (data) =>
      data.map((item) => ({ id: String(item.id), content: item })),
    refetchInterval: 5000,
  })

  const { data: dataProductStatus, isLoading: loadingProductStatus } = useQuery(
    {
      queryFn: ({ signal }) =>
        getData<ProductStatusProps<any>[]>({
          url: 'productStatus',
          signal,
        }),
      queryKey: ['product-status-get'],
    },
  )

  const { mutateAsync: mutatePutProductRol, isPending: loadingPutProductRol } =
    useMutation({
      mutationFn: (val: PutData<ProductStatusModalFormProps>) =>
        putData<ProductStatusModalFormProps, ProductStatusModalFormProps>(val),
      mutationKey: ['product-rol-put'],
    })

  const productOpened = dataProductRol?.find(
    (a) => a.content.id === idProductModalOpen,
  )

  const lancamentoItems = dataProductRol?.filter(
    (a) => a.content.productStatusId <= 7,
  )
  const lavagemItems = dataProductRol?.filter(
    (a) => a.content.productStatusId > 7 && a.content.productStatusId <= 10,
  )
  const saidaItems = dataProductRol?.filter(
    (a) => a.content.productStatusId > 10,
  )

  const [state, setState] = useState({
    lancamento: lancamentoItems ?? [],
    lavagem: lavagemItems ?? [],
    saida: saidaItems ?? [],
  })

  const { handleSubmit, setValue, control } = useForm<
    FilterMonitoringProps,
    'filter'
  >()

  const {
    handleSubmit: handleSubmitProduct,
    control: controlProduct,
    setValue: setValueProduct,
  } = useForm<ProductStatusModalFormProps, 'product'>()

  const onSubmit = (data: FilterMonitoringProps) => {
    console.log('data', data)
    const tempRols = dataRol?.filter(
      (a) => data.rolIds?.includes(a.id.toString()),
    )
    console.log('tempROls, ', tempRols)
    if (!tempRols) {
      toast.error('Rol não encontrado')
      return
    } else if (tempRols.length > 0) setRols(tempRols)
    if (data.clientIds?.length) setClientIds(data.clientIds)
    setIsFilterOpen(false)
  }

  const onSubmitProduct = (data: ProductStatusModalFormProps) => {
    console.log('data', data)
    if (!productOpened) return
    mutatePutProductRol({
      url: 'productRol',
      data: { productStatusId: Number(data.statusId) } as any,
      id: productOpened?.content.id,
    })
      .then(() => {
        toast.success('Status alterado com sucesso')
        setIsProductModalOpen(false)
        refetch()
      })
      .catch((error) => {
        toastErrorsApi(error)
      })
  }

  useEffect(() => {
    console.log('state', state)
    console.log('lancamento', lancamentoItems)
    console.log('lavagem', lavagemItems)
    console.log('saida', saidaItems)
    console.log('clientIds', clientIds)
    console.log('rols', rols)
  }, [lancamentoItems, lavagemItems, saidaItems, state, clientIds, rols])

  useEffect(() => {
    if (!loadingProductRol && dataProductRol) {
      const lancamentoItemsTemp = dataProductRol?.filter(
        (a) => a.content.productStatusId <= 7,
      )
      const lavagemItemsTemp = dataProductRol?.filter(
        (a) => a.content.productStatusId > 7 && a.content.productStatusId <= 10,
      )
      const saidaItemsTemp = dataProductRol?.filter(
        (a) => a.content.productStatusId > 10,
      )
      const sortArray = (
        array: { id: string; content: ProductRolProps<any> }[],
        property: string,
      ) => {
        array?.sort((a, b) => {
          let propA: any
          let propB: any

          if (property in a.content && property in b.content) {
            propA = a.content[property as keyof typeof a.content]
            propB = b.content[property as keyof typeof b.content]
          }

          if (property === 'client') {
            propA = a.content.rol?.client?.fantasyName
            propB = b.content.rol?.client?.fantasyName
          }

          if (propA < propB) {
            return -1
          }
          if (propA > propB) {
            return 1
          }
          return 0
        })
      }

      if (orderBy === 'name' || orderBy === 'status' || orderBy === 'client') {
        sortArray(lancamentoItemsTemp, orderBy)
        sortArray(lavagemItemsTemp, orderBy)
        sortArray(saidaItemsTemp, orderBy)
      }
      setState({
        lancamento: lancamentoItemsTemp ?? [],
        lavagem: lavagemItemsTemp ?? [],
        saida: saidaItemsTemp ?? [],
      })
    }
  }, [loadingProductRol, dataProductRol, orderBy])

  const loading =
    loadingProductRol ||
    loadingProductStatus ||
    loadingRol ||
    loadingPutProductRol

  useEffect(() => {
    if (productOpened) {
      setValueProduct(
        'statusId',
        String(productOpened?.content.productStatusId),
      )
    }
  }, [productOpened, setValueProduct])

  useEffect(() => {
    console.log(isProductModalOpen)
  }, [isProductModalOpen])

  useEffect(() => {
    if (!rols) setValue('rolIds', undefined)
    if (!clientIds) setValue('clientIds', undefined)
  }, [rols, setValue, clientIds])

  const dataClients = dataRol
    ?.filter((a) => a.client !== undefined)
    .map((a) => a.client as ClientProps)

  const clientsUnique = dataClients
    ?.map((a) => a)
    .filter(
      (v, i, a) =>
        a.findIndex(
          (t) => t?.id === v?.id && t?.fantasyName === v?.fantasyName,
        ) === i,
    )

  return (
    <div className="flex w-full gap-4">
      {loading && <Loading />}
      <ContainerProductRol titleName="Lançamento">
        {!state.lancamento?.length && <Empty message="Nenhum produto" />}
        {state.lancamento?.map((item) => (
          <CardProductRol key={item.id} item={item} />
        ))}
      </ContainerProductRol>
      <ContainerProductRol titleName="Lavagem">
        {!state.lavagem?.length && <Empty message="Nenhum produto" />}
        {state.lavagem?.map((item) => (
          <CardProductRol key={item.id} item={item} />
        ))}
      </ContainerProductRol>
      <ContainerProductRol titleName="Saída">
        {!state.saida?.length && <Empty message="Nenhum produto" />}
        {state.saida?.map((item) => (
          <CardProductRol key={item.id} item={item} />
        ))}
      </ContainerProductRol>
      <Modal
        isOpen={isFilterOpen}
        backdrop="opaque"
        classNames={{
          backdrop: 'blur-md',
        }}
        onOpenChange={(open) => {
          setIsFilterOpen(open)
        }}
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
                            <Combobox
                              id={field.name}
                              data={clientsUnique}
                              value={field.value ?? ''}
                              onChange={field.onChange}
                              label="Cliente"
                              filterKey={['fantasyName', 'corporateName']}
                              textValueKey="fantasyName"
                              isRequired
                              itemRenderer={(item) => (
                                <div className="flex flex-col gap-2">
                                  <span className="font-bold">
                                    {item.fantasyName}
                                  </span>
                                  <small className="text-tiny text-default-400">
                                    {item.address?.publicArea},{' '}
                                    {item.address?.number}
                                  </small>
                                </div>
                              )}
                            />
                          </Skeleton>
                        )}
                      />
                    )}
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
      <Modal
        isOpen={isProductModalOpen}
        backdrop="opaque"
        classNames={{
          backdrop: 'blur-md',
        }}
        onOpenChange={(open) => {
          setIsProductModalOpen(open)
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="mt-4 flex flex-col gap-1">
                Detalhes
              </ModalHeader>
              <ModalBody>
                <form
                  autoComplete="off"
                  onSubmit={handleSubmitProduct(onSubmitProduct)}
                  className="flex w-full flex-col gap-4"
                  id="formProduct"
                >
                  <span className="text-lg font-bold">
                    {productOpened?.content.name}
                  </span>
                  <Controller
                    name="statusId"
                    control={controlProduct}
                    rules={{ required: 'Campo obrigatório' }}
                    // defaultValue={String(
                    //   productOpened?.content.productStatusId,
                    // )}
                    render={({ field, fieldState: { error } }) => (
                      <Skeleton
                        className="rounded-md"
                        isLoaded={!loadingProductStatus}
                      >
                        <Select
                          label="Status"
                          id={field.name}
                          onChange={field.onChange}
                          name={field.name}
                          selectedKeys={
                            field.value ? [field.value] : new Set([])
                          }
                          variant="bordered"
                          color="primary"
                          isRequired
                          isInvalid={!!error}
                          errorMessage={error?.message}
                          classNames={{
                            value: 'text-foreground',
                          }}
                          items={dataProductStatus ?? []}
                          isLoading={loadingProductStatus}
                        >
                          {(item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          )}
                        </Select>
                      </Skeleton>
                    )}
                  />
                  <span>
                    Rol: <b>{productOpened?.content.rol?.id}</b>
                  </span>
                  <span>
                    Cliente:{' '}
                    <b>{productOpened?.content.rol?.client?.fantasyName}</b>
                  </span>
                </form>
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
                  form="formProduct"
                  type="submit"
                  variant="flat"
                  color="primary"
                  className="w-fit"
                >
                  Mudar status
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
