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
  Chip,
  Image,
  Input,
  Select,
  SelectItem,
  Skeleton,
} from '@nextui-org/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Row } from 'components/grid/row'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { productTypeOptions } from './constants'
import {
  ProductDefaultProps,
  ProductFormProps,
  ProductFormSendProps,
} from './types'

import NextImage from 'next/image'
import { convertToBase64 } from '@/utils/functions'

const ProductEdit = () => {
  const { id } = useParams<{ id: string | 'new' }>()

  const { data: dataGetProduct, isLoading: loadingGet } = useQuery({
    queryFn: ({ signal }) =>
      getData<ProductDefaultProps>({
        url: 'product',
        id: parseInt(id, 10),
        signal,
        query: 'include.group=true',
      }),
    queryKey: ['product-get', id],
    enabled: id !== 'new',
  })

  const { mutateAsync: mutatePost, isPending: loadingPost } = useMutation({
    mutationFn: async (val: PostData<ProductFormSendProps>) =>
      postData<ProductDefaultProps, ProductFormSendProps>(val),
    mutationKey: ['product-post'],
  })

  const { mutateAsync: mutatePut, isPending: loadingPut } = useMutation({
    mutationFn: (val: PutData<ProductFormSendProps>) =>
      putData<ProductDefaultProps, ProductFormSendProps>(val),
    mutationKey: ['product-put'],
  })

  const { handleSubmit, setValue, control, reset, watch } = useForm<
    ProductFormProps,
    'products'
  >()

  const [files, setFiles] = useState<File[]>([])

  const type = watch('type')

  const onSubmit = async (data: ProductFormProps) => {
    const photosPromises = files.map((file) => {
      return convertToBase64(file)
    })

    const photos = (await Promise.all(photosPromises)).filter(
      (a) => a !== null,
    ) as string[] | null

    const parseData: ProductFormSendProps = {
      ...data,
      height: undefined,
      width: undefined,
      diameter: undefined,
      round: false,
      price: data.price ? Number(data.price) : 0,
      photos: photos && photos.length > 0 ? photos : undefined,
      defects: undefined,
      colors: undefined,
      backgrounds: undefined,
      edges: undefined,
      stamps: undefined,
      hairHeights: undefined,
    }

    if (id === 'new')
      mutatePost({
        url: '/product',
        data: parseData,
      })
        .then(() => {
          toast.success('Produto cadastrado com sucesso')
          reset()
          setFiles([])
        })
        .catch((error: any) => {
          toastErrorsApi(error)
        })
    else
      mutatePut({
        url: '/product',
        data: parseData,
        id: parseInt(id, 10),
      })
        .then(() => {
          toast.success(`Produto atualizado com sucesso.`)
        })
        .catch((err) => {
          toastErrorsApi(err)
        })
  }

  const loading = loadingGet || loadingPost || loadingPut

  useEffect(() => {
    if (dataGetProduct && id !== 'new') {
      setValue('name', dataGetProduct.name)
      setValue('description', dataGetProduct.description)
      setValue('observation', dataGetProduct.observation)
      setValue('type', dataGetProduct.type)
      setValue('height', dataGetProduct.height?.toString() ?? '')
      setValue('width', dataGetProduct.width?.toString() ?? '')
      setValue('diameter', dataGetProduct.diameter?.toString() ?? '')
      setValue('price', dataGetProduct.price.toString())
      setValue('round', dataGetProduct.round)
      setValue('photos', dataGetProduct.photos)
    }
  }, [dataGetProduct, id, setValue])

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
        <Controller
          name="type"
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
        <Controller
          name="description"
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

        <Controller
          name="price"
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
                    <span className="text-small text-default-400">R$</span>
                  </div>
                }
              />
            </Skeleton>
          )}
        />
        <Controller
          name="photos"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Skeleton className="rounded-md" isLoaded={!loading}>
              <div className="w-full">
                <span
                  className={
                    'text-primary transition-[transform,color,left,opacity] !duration-200 !ease-out'
                  }
                >
                  Fotos
                </span>
                <label className="flex h-full w-fit cursor-pointer flex-col justify-center rounded-md bg-default-100 px-3 py-2">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setFiles(Array.from(e.target.files))
                        // setValue('photos', undefined)
                      }
                    }}
                  />
                  <span>Enviar arquivo</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {files.map((file) => (
                    <Chip
                      isCloseable
                      onClose={() => {
                        setFiles(files.filter((a) => a.name !== file.name))
                      }}
                      classNames={{
                        base: 'rounded-none bg-transparent mt-2 h-full px-0 items-start',
                        content: 'px-0',
                        closeButton: 'text-3xl ml-1',
                      }}
                      key={file.name}
                    >
                      <Image
                        as={NextImage}
                        src={URL.createObjectURL(file)}
                        width={150}
                        height={150}
                        alt={file.name}
                        className={'rounded-md'}
                        isZoomed
                      />
                    </Chip>
                  ))}
                </div>
                {id !== 'new' && (
                  <div className="flex flex-wrap gap-2">
                    {files.length === 0 &&
                      dataGetProduct?.photos?.map((photo) => (
                        <Chip
                          isCloseable
                          onClose={() => {
                            setValue(
                              field.name,
                              field.value?.filter((a) => a !== photo),
                            )
                          }}
                          classNames={{
                            base: 'rounded-none bg-transparent mt-2 h-full px-0 items-start',
                            content: 'px-0',
                            closeButton: 'text-3xl ml-1',
                          }}
                          key={photo}
                        >
                          <Image
                            as={NextImage}
                            src={photo}
                            width={150}
                            height={150}
                            alt={photo}
                            className={'rounded-md'}
                            isZoomed
                          />
                        </Chip>
                      ))}
                  </div>
                )}
              </div>
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
    </form>
  )
}

export default ProductEdit
