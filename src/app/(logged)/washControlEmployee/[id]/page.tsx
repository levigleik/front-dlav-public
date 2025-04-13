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
  Button,
  Input,
  Select,
  SelectItem,
  Skeleton,
  Switch,
} from '@nextui-org/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Row } from 'components/grid/row'
import { useParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { WashControlEmployeeProps } from '@/types/washControlEmployee'
import { WashControlEmployeeFormProps } from '@/app/(logged)/washControlEmployee/[id]/types'
import { ProductDefaultProps } from '@/app/(logged)/product/[id]/types'
import { EmployeeProps } from '@/types/employee'
import { Combobox } from '@/components/ui/combobox'
import { firstDeployClients } from '@/app/(logged)/client/constants'

const WashControlEdit = () => {
  const { id } = useParams<{ id: string | 'new' }>()

  const { data: dataGetWashControlEmployee, isLoading: loadingGet } = useQuery({
    queryFn: ({ signal }) =>
      getData<WashControlEmployeeProps<ClientProps, ProductDefaultProps>>({
        url: 'washControlEmployee',
        id: parseInt(id, 10),
        signal,
        query: 'include.employee=true',
      }),
    queryKey: ['wash-control-get', id],
    enabled: id !== 'new',
  })

  const { mutateAsync: mutatePost, isPending: loadingPost } = useMutation({
    mutationFn: async (
      val: PostData<WashControlEmployeeProps<ClientProps, ProductDefaultProps>>,
    ) =>
      postData<
        WashControlEmployeeProps<ClientProps, ProductDefaultProps>,
        WashControlEmployeeProps<ClientProps, ProductDefaultProps>
      >(val),
    mutationKey: ['wash-control-post'],
  })

  const { mutateAsync: mutatePut, isPending: loadingPut } = useMutation({
    mutationFn: (
      val: PutData<WashControlEmployeeProps<ClientProps, ProductDefaultProps>>,
    ) =>
      putData<
        WashControlEmployeeProps<ClientProps, ProductDefaultProps>,
        WashControlEmployeeProps<ClientProps, ProductDefaultProps>
      >(val),
    mutationKey: ['wash-control-put'],
  })

  const { handleSubmit, setValue, control, reset, watch } = useForm<
    WashControlEmployeeFormProps,
    'washControlEmployee'
  >()

  const clientId = watch('clientId')

  const { data: dataProduct, isLoading: loadingProduct } = useQuery({
    queryFn: ({ signal }) =>
      getData<EmployeeProps<any>[]>({
        url: 'product',
        query: `${
          !!clientId ? `where.group.priceList.clientId=${clientId}` : ''
        }`,
        signal,
      }),
    queryKey: ['product-get', clientId],
    enabled: !!clientId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const { data: dataEmployee, isLoading: loadingEmployee } = useQuery({
    queryFn: ({ signal }) =>
      getData<EmployeeProps<any>[]>({
        url: 'employee',
        signal,
        query: `${!!clientId ? `where.clientId=${clientId}` : ''}`,
      }),
    queryKey: ['employee-get', clientId],
    enabled: !!clientId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
      return data?.filter((item) =>
        firstDeployClients.some((item2) =>
          item.fantasyName.toLowerCase().includes(item2.toLowerCase()),
        ),
      )
    },
  })

  const onSubmit = (data: WashControlEmployeeFormProps) => {
    const parseData = {
      ...data,
      productId: Number(data.productId),
      employeeId: Number(data.employeeId),
      used: Number(data.used),
      limit: Number(data.limit),
      avaliation: Number(data.avaliation),
    }
    if (id === 'new')
      mutatePost({
        url: '/washControlEmployee',
        data: parseData,
      })
        .then(() => {
          toast.success('Controle de limpeza cadastrado com sucesso')
          setValue('productId', '')
        })
        .catch((error: any) => {
          toastErrorsApi(error)
        })
    else
      mutatePut({
        url: '/washControlEmployee',
        data: parseData,
        id: parseInt(id, 10),
      })
        .then(() => {
          toast.success('Controle de limpeza atualizado com sucesso')
        })
        .catch((err) => {
          toastErrorsApi(err)
        })
  }

  const loading =
    loadingGet || loadingPost || loadingPut || loadingProduct || loadingEmployee

  useEffect(() => {
    if (dataGetWashControlEmployee && id !== 'new') {
      setValue('employeeId', String(dataGetWashControlEmployee.employeeId))
      setValue(
        'clientId',
        String(dataGetWashControlEmployee.employee?.clientId),
      )
      setValue('productId', String(dataGetWashControlEmployee.productId))
      setValue('limit', String(dataGetWashControlEmployee.limit))
      setValue('avaliation', String(dataGetWashControlEmployee.avaliation))
      setValue('used', String(dataGetWashControlEmployee.used))
      setValue('active', dataGetWashControlEmployee.active)
    }
  }, [dataGetWashControlEmployee, id, setValue])

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <Row>
        <Controller
          name="active"
          control={control}
          defaultValue={true}
          render={({ field }) => (
            <Skeleton className="rounded-md" isLoaded={!loading}>
              <Switch
                id={field.name}
                name={field.name}
                isSelected={field.value}
                onValueChange={(value) => {
                  field.onChange(value)
                }}
                color="primary"
              >
                <div className="flex">
                  <p className="text-medium">Ativo</p>
                </div>
              </Switch>
            </Skeleton>
          )}
        />
      </Row>

      <Row>
        <Controller
          name="limit"
          control={control}
          defaultValue="0"
          rules={{ required: 'Campo obrigatório' }}
          render={({ field, fieldState: { error } }) => (
            <Skeleton className="rounded-md" isLoaded={!loading}>
              <Input
                label="Limite"
                id={field.name}
                type="number"
                min={0}
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
        <Controller
          name="avaliation"
          control={control}
          defaultValue="0"
          rules={{ required: 'Campo obrigatório' }}
          render={({ field, fieldState: { error } }) => (
            <Skeleton className="rounded-md" isLoaded={!loading}>
              <Input
                label="Avaliação"
                id={field.name}
                type="number"
                min={0}
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
        <Controller
          name="used"
          control={control}
          defaultValue="0"
          rules={{ required: 'Campo obrigatório' }}
          render={({ field, fieldState: { error } }) => (
            <Skeleton className="rounded-md" isLoaded={!loading}>
              <Input
                label="Usado"
                id={field.name}
                type="number"
                min={0}
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
        <Controller
          name="clientId"
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
        <Controller
          name="employeeId"
          control={control}
          rules={{ required: 'Campo obrigatório' }}
          render={({ field, fieldState: { error } }) => (
            <Skeleton className="rounded-md" isLoaded={!loading}>
              <Select
                label="Empregado"
                id={field.name}
                onChange={field.onChange}
                name={field.name}
                selectedKeys={field.value ? [field.value] : new Set([])}
                variant="bordered"
                color="primary"
                isRequired
                isInvalid={!!error}
                errorMessage={error?.message}
                classNames={{
                  value: 'text-foreground',
                }}
                items={dataEmployee ?? []}
                isLoading={loadingEmployee}
              >
                {(item) => (
                  <SelectItem
                    key={item.id}
                    value={item.id}
                    textValue={item.name}
                  >
                    <div className="flex flex-col gap-2">
                      <span className="font-bold">{item.name}</span>
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
        {clientId && (
          <Controller
            name="productId"
            control={control}
            rules={{ required: 'Campo obrigatório' }}
            render={({ field, fieldState: { error } }) => (
              <Skeleton
                className="h-14 rounded-md [&>div]:h-14"
                isLoaded={!loadingProduct}
              >
                <Combobox
                  id={field.name}
                  data={dataProduct ?? []}
                  value={field.value}
                  onChange={field.onChange}
                  label="Produto"
                  idKey="id"
                  textValueKey="name"
                  itemRenderer={(item) => (
                    <div className="flex flex-col gap-2">
                      <span className="font-bold">{item.name}</span>
                    </div>
                  )}
                  filterKey={['name']}
                  isRequired
                />
              </Skeleton>
            )}
          />
        )}
      </Row>
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

export default WashControlEdit
