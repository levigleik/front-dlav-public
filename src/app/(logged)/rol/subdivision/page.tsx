'use client'

import React, { useEffect } from 'react'
import { Button, Chip, Select, SelectItem, Skeleton } from '@nextui-org/react'
import { Controller, useForm } from 'react-hook-form'
import Loading from 'components/loading'
import { Row } from 'components/grid/row'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getData, putData, toastErrorsApi } from '@/utils/functions.api'
import { useSearchParams } from 'next/navigation'
import { SubdivisionFormProps } from '@/app/(logged)/rol/cart/(tabs)/types'
import { formatBRL } from '@/utils/functions'
import { ProductStatusProps } from '@/types/productStatus'
import { ProductRolProps } from '@/types/productRol'
import { PutData } from '@/types'
import { toast } from 'react-toastify'
import { ProductRolGroupProps } from '@/types/productRolGroup'

export default function Subdivision() {
  const id = useSearchParams().get('id')

  const { data: dataGetProductRolGroup, isLoading: loadingGetProductRolGroup } =
    useQuery({
      queryFn: ({ signal }) =>
        getData<ProductRolGroupProps>({
          url: 'productRolGroup',
          id: id ? Number(id) : undefined,
          query: `include.products=true`,
          signal,
        }),
      queryKey: ['product-rol-get', id],
      enabled: !!id,
    })

  const { data: dataGetStatus, isLoading: loadingGetStatus } = useQuery({
    queryFn: ({ signal }) =>
      getData<ProductStatusProps<any>[]>({
        url: 'productStatus',
        signal,
      }),
    queryKey: ['product-status-get'],
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const { mutateAsync: mutatePut, isPending: loadingPut } = useMutation({
    mutationFn: async (val: PutData<Partial<ProductRolProps<any>>>) =>
      putData<ProductRolProps<any>, Partial<ProductRolProps<any>>>(val),
    mutationKey: ['rol-put'],
  })
  const { handleSubmit, setValue, control, reset, watch } = useForm<
    SubdivisionFormProps,
    'groups'
  >()

  const loading = loadingGetProductRolGroup || loadingPut

  const onSubmit = async (data: SubdivisionFormProps) => {
    mutatePut({
      url: 'productRolGroup',
      id: Number(id),
      data: { productStatusId: Number(data.productStatusId) },
    })
      .then(() => {
        toast.success('Status atualizado com sucesso')
      })
      .catch((err) => {
        toastErrorsApi(err)
      })
  }

  useEffect(() => {
    if (id) {
      setValue(
        'productRolIds',
        dataGetProductRolGroup?.products.map((a) => String(a.id)) ?? [],
      )
      setValue(
        'productStatusId',
        String(dataGetProductRolGroup?.productStatusId),
      )
    }
  }, [dataGetProductRolGroup, id, setValue])

  return (
    <div className="flex w-full flex-col gap-4">
      {loading && <Loading />}
      <form
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <div className="flex flex-col gap-4 overflow-auto rounded-large bg-content1 p-4 shadow-small">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xl font-bold text-default-600">
              {dataGetProductRolGroup?.name}
            </span>
          </div>
          <Row>
            <Controller
              name="productRolIds"
              control={control}
              rules={{ required: 'Campo obrigatório' }}
              render={({ field, fieldState: { error } }) => (
                <Skeleton className="rounded-md" isLoaded={!loading}>
                  <Select
                    label="Produtos"
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
                    isRequired
                    isDisabled
                    errorMessage={error?.message}
                    classNames={{
                      value: 'text-foreground',
                      label: 'overflow-visible',
                    }}
                    isLoading={loading}
                    items={dataGetProductRolGroup?.products ?? []}
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
                                {item.data?.quantity}x {item.data?.name} -{' '}
                                {formatBRL.format(item.data?.price ?? 0)}
                              </Chip>
                            </div>
                          ))}
                        </div>
                      )
                    }}
                  >
                    {(item) => (
                      <SelectItem
                        key={String(item.id)}
                        className="capitalize"
                        textValue={String(item.id)}
                      >
                        <div className="flex flex-col gap-2">
                          <span className="font-bold">
                            {item?.quantity}x {item?.name} -{' '}
                            {formatBRL.format(item?.price ?? 0)}
                          </span>
                        </div>
                      </SelectItem>
                    )}
                  </Select>
                </Skeleton>
              )}
            />
            <Controller
              name="productStatusId"
              control={control}
              rules={{ required: 'Campo obrigatório' }}
              render={({ field, fieldState: { error } }) => (
                <Skeleton className="rounded-md" isLoaded={!loading}>
                  <Select
                    label="Status"
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
                    items={dataGetStatus ?? []}
                    isLoading={loadingGetStatus}
                  >
                    {(item) => (
                      <SelectItem
                        key={item.id}
                        value={item.id}
                        textValue={item.name}
                      >
                        <div className="flex flex-col gap-2">
                          <span className="font-bold">{item.name}</span>
                        </div>
                      </SelectItem>
                    )}
                  </Select>
                </Skeleton>
              )}
            />
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
        </div>
      </form>
    </div>
  )
}
