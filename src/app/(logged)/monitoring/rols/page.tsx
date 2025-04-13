'use client'

import React, { useEffect, useState } from 'react'
import ContainerProductRol from '@/app/(logged)/monitoring/rols/container'
import CardRol from '@/app/(logged)/monitoring/rols/card'
import { useQuery } from '@tanstack/react-query'
import { getData } from '@/utils/functions.api'
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
import { useMonitoringRolHook } from '@/app/(logged)/monitoring/rols/hooks'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import {
  FilterMonitoringProps,
  ProductStatusModalFormProps,
} from '@/app/(logged)/monitoring/rols/types'
import Loading from 'components/loading'
import Empty from '@/app/(logged)/monitoring/rols/empty'
import { Combobox } from 'components/ui/combobox'
import { ClientProps } from '@/types/client'
import { ProductStatusProps } from '@/types/productStatus'
import { sortArray } from '@/app/(logged)/monitoring/rols/functions'

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
  } = useMonitoringRolHook()

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
          'include.client=true&&' +
          'include.productGroups&&' +
          `${rols ? `&&where.id.in=[${rols?.map((a) => a.id)}]` : ''}${
            clientIds ? `&&where.clientId.in=[${clientIds}]` : ''
          }&&orderBy.createdAt=asc&&where.AND[0].status.not=finished` +
          `&&where.AND[1].status.not=canceled`,
      }),
    queryKey: ['monitoring-rol-get', rols, clientIds],
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

  const [col1, setCol1] = useState<RolProps[]>([])
  const [col2, setCol2] = useState<RolProps[]>([])
  const [col3, setCol3] = useState<RolProps[]>([])

  const rolOpened = dataRol?.find((a) => a.id === idProductModalOpen)

  const { handleSubmit, setValue, control } = useForm<
    FilterMonitoringProps,
    'filter'
  >()

  const { control: controlProductGroup, setValue: setValueProductGroup } =
    useForm<ProductStatusModalFormProps, 'product'>()

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

  useEffect(() => {
    if (!loadingRol && dataRol) {
      const inProgress = dataRol?.filter((a) => a?.status === 'inProgress')
      const paused = dataRol?.filter((a) => a?.status === 'paused')
      const col1Temp = inProgress.slice(0, Math.floor(dataRol.length * 0.5))
      const col2Temp = inProgress.slice(
        Math.floor(dataRol.length * 0.5),
        inProgress?.length,
      )

      setCol1(col1Temp)
      setCol2(col2Temp)
      setCol3(paused)
    }
  }, [loadingRol, dataRol])

  useEffect(() => {
    if (orderBy === 'name' || orderBy === 'status' || orderBy === 'client') {
      setCol1(sortArray(col1, orderBy))
      setCol2(sortArray(col2, orderBy))
      setCol3(sortArray(col3, orderBy))
    }
  }, [orderBy, col1, col2, col3])

  const loading = loadingRol || loadingRol

  useEffect(() => {
    if (rolOpened) {
      setValueProductGroup('statusId', String(rolOpened?.id))
    }
  }, [rolOpened, setValueProductGroup])

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

  console.log('rolOpened', rolOpened)

  return (
    <div className="flex w-full gap-4">
      {loading && <Loading />}
      <ContainerProductRol titleName="Produção">
        {!col1?.length && <Empty />}
        {col1?.map((item) => <CardRol key={item.id} item={item} />)}
      </ContainerProductRol>
      <ContainerProductRol titleName="Produção">
        {!col2?.length && <Empty />}
        {col2?.map((item) => <CardRol key={item.id} item={item} />)}
      </ContainerProductRol>
      <ContainerProductRol titleName="Em espera">
        {!col3?.length && <Empty />}
        {col3?.map((item) => <CardRol key={item.id} item={item} />)}
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
                Loteamento
              </ModalHeader>
              <ModalBody>
                {!rolOpened?.productGroups?.length && (
                  <Empty message="Nenhum lote" />
                )}
                {rolOpened?.productGroups?.map((group) => (
                  <div key={group.id}>
                    <span className="font-bold">{group.name}</span>
                    <Controller
                      name="statusId"
                      control={controlProductGroup}
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
                            selectedKeys={[String(group.productStatusId)]}
                            variant="bordered"
                            color="primary"
                            isRequired
                            isInvalid={!!error}
                            errorMessage={error?.message}
                            classNames={{
                              value: 'text-foreground',
                            }}
                            isDisabled
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
                  </div>
                ))}
              </ModalBody>
              <ModalFooter />
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
