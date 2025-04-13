'use client'

import { PostData, PutData } from '@/types'
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
  Tooltip,
} from '@nextui-org/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Row } from 'components/grid/row'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { GroupDefaultProps, GroupFormProps, GroupFormSendProps } from './types'
import {
  ProductDefaultProps,
  ProductFormSendProps,
} from '@/app/(logged)/product/[id]/types'
import { FaTrash } from 'react-icons/fa'
import { productTypeOptions } from '@/app/(logged)/product/[id]/constants'
import { PriceListProps } from '@/types/priceList'
import { ClientProps } from '@/types/client'
import { Combobox } from 'components/ui/combobox'

const ProductEdit = () => {
  const { id } = useParams<{ id: string | 'new' }>()

  const { data: dataGetGroup, isLoading: loadingGet } = useQuery({
    queryFn: ({ signal }) =>
      getData<GroupDefaultProps>({
        url: 'group',
        id: parseInt(id, 10),
        signal,
        query: 'include.products=true',
      }),
    queryKey: ['group-get', id],
    enabled: id !== 'new',
  })

  const { data: dataPriceList, isLoading: loadingPriceList } = useQuery({
    queryFn: ({ signal }) =>
      getData<PriceListProps<any, any, ClientProps>[]>({
        url: 'pricelist',
        signal,
        query: 'include.client=true&&orderBy.name=asc',
      }),
    queryKey: ['price-list-get'],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const { mutateAsync: mutatePost, isPending: loadingPost } = useMutation({
    mutationFn: async (val: PostData<GroupFormSendProps>) =>
      postData<ProductDefaultProps, GroupFormSendProps>(val),
    mutationKey: ['group-post'],
  })

  const { mutateAsync: mutatePut, isPending: loadingPut } = useMutation({
    mutationFn: (val: PutData<GroupFormSendProps>) =>
      putData<ProductDefaultProps, GroupFormSendProps>(val),
    mutationKey: ['group-put'],
  })

  const { handleSubmit, setValue, control, reset, watch } = useForm<
    GroupFormProps,
    'groups'
  >()

  const {
    fields: productFields,
    append: appendProduct,
    remove: removeProduct,
  } = useFieldArray({
    control,
    name: 'products',
  })

  const onSubmit = (data: GroupFormProps) => {
    const parseData: GroupFormSendProps = {
      ...data,
      priceListId: Number(data.priceListId),
      products: data.products.map((product: ProductFormSendProps) => ({
        ...product,
        height: undefined,
        width: undefined,
        diameter: undefined,
        round: false,
        photos: undefined,
        price: product.price ? Number(product.price) : 0,
      })),
    }

    if (id === 'new')
      mutatePost({
        url: '/group',
        data: parseData,
      })
        .then(() => {
          toast.success('Grupo cadastrado com sucesso')
          reset()
          removeProduct()
        })
        .catch((error: any) => {
          toastErrorsApi(error)
        })
    else
      mutatePut({
        url: '/group',
        data: parseData,
        id: parseInt(id, 10),
      })
        .then(() => {
          toast.success(`Grupo atualizado com sucesso.`)
        })
        .catch((err) => {
          toastErrorsApi(err)
        })
  }

  const loading = loadingGet || loadingPost || loadingPut

  useEffect(() => {
    if (dataGetGroup && id !== 'new') {
      setValue('name', dataGetGroup.name)
      setValue('priceListId', String(dataGetGroup.priceListId) as any)
      const products = dataGetGroup.products?.map((b) => {
        return {
          ...b,
          height: undefined,
          width: undefined,
          diameter: undefined,
          round: false,
          price: String(b.price),
        }
      })
      if (products) appendProduct(products)
    }
  }, [appendProduct, dataGetGroup, id, setValue])

  useEffect(() => {
    appendProduct({
      name: '',
    })
  }, [appendProduct])

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
                classNames={{
                  inputWrapper: 'col-span-2',
                }}
                isRequired
                isInvalid={!!error}
                errorMessage={error?.message}
              />
            </Skeleton>
          )}
        />
        <Controller
          name="priceListId"
          control={control}
          rules={{ required: 'Campo obrigatório' }}
          render={({ field, fieldState: { error } }) => (
            <Skeleton
              className="[&>div]:min-h-14 min-h-14 rounded-md"
              isLoaded={!loadingPriceList}
            >
              <Combobox
                data={dataPriceList ?? []}
                value={field.value}
                onChange={field.onChange}
                label="Tabela de preço"
                filterKey={['name']}
                textValueKey="name"
                isRequired
                id={field.name}
                itemRenderer={(item) => (
                  <div className="flex flex-col gap-2">
                    <span className="font-bold">{item.name}</span>
                    <small className="text-tiny text-default-400">
                      {item.client?.fantasyName ??
                        item.client?.corporateName ??
                        'Sem empresa'}
                    </small>
                  </div>
                )}
              />
            </Skeleton>
          )}
        />
      </Row>
      <div className="flex flex-col gap-4">
        {productFields?.map((item, indexProducts) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 overflow-auto rounded-large bg-content1 p-4 shadow-small"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xl font-bold text-default-600">
                Produto {indexProducts + 1}
              </span>
              <Tooltip
                content="Deletar produto"
                placement="bottom-end"
                className="text-white"
                color="danger"
              >
                <Button
                  type="button"
                  color="danger"
                  className="w-fit rounded-full text-main-white"
                  onClick={() => removeProduct(indexProducts)}
                  isDisabled={loading}
                  isIconOnly
                >
                  <FaTrash size={20} className="text-white" />
                </Button>
              </Tooltip>
            </div>
            <Row>
              <Controller
                name={`products.${indexProducts}.name`}
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
              <Controller
                name={`products.${indexProducts}.type`}
                control={control}
                rules={{ required: 'Campo obrigatório' }}
                defaultValue="outro"
                render={({ field, fieldState: { error } }) => (
                  <Skeleton className="rounded-md" isLoaded={!loading}>
                    <Select
                      label="Categoria"
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
                    >
                      {productTypeOptions.map((a) => (
                        <SelectItem key={a.value} value={a.value}>
                          {a.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </Skeleton>
                )}
              />
            </Row>
            <Row>
              <Controller
                name={`products.${indexProducts}.description`}
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <Skeleton className="rounded-md" isLoaded={!loading}>
                    <Input
                      label="Descrição"
                      id={field.name}
                      type="text"
                      onChange={field.onChange}
                      name={field.name}
                      value={field.value}
                      variant="bordered"
                      color="primary"
                      isInvalid={!!error}
                      errorMessage={error?.message}
                    />
                  </Skeleton>
                )}
              />
            </Row>

            <Row>
              <Controller
                name={`products.${indexProducts}.price`}
                control={control}
                defaultValue=""
                rules={{
                  validate: (value) => {
                    if (Number(value) < 0) return 'Preço não pode ser negativo'
                    return true
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Skeleton className="rounded-md" isLoaded={!loading}>
                    <Input
                      label="Preço"
                      id={field.name}
                      type="number"
                      onChange={field.onChange}
                      name={field.name}
                      value={field.value}
                      variant="bordered"
                      color="primary"
                      isRequired
                      isInvalid={!!error}
                      errorMessage={error?.message}
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-small text-default-400">
                            R$
                          </span>
                        </div>
                      }
                    />
                  </Skeleton>
                )}
              />
            </Row>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="bordered"
        color="primary"
        className="w-fit rounded-full data-[hover=true]:bg-main-200 data-[hover=true]:text-main-white"
        isDisabled={loading}
        onClick={() => {
          appendProduct({
            name: '',
          })
        }}
      >
        Adicionar produto
      </Button>
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

export default ProductEdit
