'use client'
import Loading from '@/components/loading'
import { getData, toastErrorsApi } from '@/utils/functions.api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRolHook } from '../hook'
import TabsFunc from '../tabs'
import { ProductDefaultProps } from '@/app/(logged)/product/[id]/types'
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Chip,
  cn,
  Image,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Skeleton,
  Switch,
  Tooltip,
} from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ClientProps } from '@/types/client'
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { convertToBase64, formatBRL } from '@/utils/functions'
import { ProductDetailsProps } from '@/app/(logged)/rol/new/(tabs)/details.types'

import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import NextImage from 'next/image'
import { Calendar } from 'components/ui/calendar'
import { ptBR } from 'date-fns/locale'
import { useCart } from '@/app/(logged)/rol/cart/hook'

const DetailsTab = () => {
  const {
    tab,
    setTab,
    setClientId,
    setPriceListId,
    clientId,
    employeeId,
    isWashControl,
  } = useRolHook()
  const {
    addProduct,
    addClient,
    setCart,
    cart,
    tempCart,
    productTemp: product,
    setProductTemp: setProduct,
  } = useCart()

  const { handleSubmit, setValue, control, reset, watch } = useForm<
    ProductDetailsProps,
    'rols'
  >({
    defaultValues: {
      additionals: [
        {
          name: '',
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additionals',
  })

  const router = useRouter()

  const { isPending: loadingGetClient, mutateAsync: mutateGetClient } =
    useMutation({
      mutationFn: () =>
        getData<ClientProps>({
          url: `client/${clientId}`,
          query: 'include.address=true',
        }),
      mutationKey: ['client-get', clientId],
    })

  const { data: dataHairHeights, isLoading: loadingHairHeights } = useQuery({
    queryFn: ({ signal }) =>
      getData<ProductDefaultProps['hairHeights']>({
        url: 'hairHeight',
        signal,
        query: 'orderBy.name=asc',
      }),
    queryKey: ['hairHeight-get'],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const { data: dataStamps, isLoading: loadingStamps } = useQuery({
    queryFn: ({ signal }) =>
      getData<ProductDefaultProps['stamps']>({
        url: 'stamp',
        signal,
        query: 'orderBy.name=asc',
      }),
    queryKey: ['stamps-get'],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const { data: dataEdges, isLoading: loadingEdges } = useQuery({
    queryFn: ({ signal }) =>
      getData<ProductDefaultProps['edges']>({
        url: 'edge',
        signal,
        query: 'orderBy.name=asc',
      }),
    queryKey: ['edges-get'],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const { data: dataBackgrounds, isLoading: loadingBackgrounds } = useQuery({
    queryFn: ({ signal }) =>
      getData<ProductDefaultProps['backgrounds']>({
        url: 'background',
        signal,
        query: 'orderBy.name=asc',
      }),
    queryKey: ['backgrounds-get'],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const { data: dataColors, isLoading: loadingColors } = useQuery({
    queryFn: ({ signal }) =>
      getData<ProductDefaultProps['colors']>({
        url: 'color',
        signal,
        query: 'orderBy.name=asc',
      }),
    queryKey: ['colors-get'],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const { data: dataDefects, isLoading: loadingDefects } = useQuery({
    queryFn: ({ signal }) =>
      getData<ProductDefaultProps['defects']>({
        url: 'defect',
        signal,
        query: 'orderBy.name=asc',
      }),
    queryKey: ['defect-get'],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const [defectsSelected, setDefectsSelected] = useState<string[]>([])

  const [backgroundSelected, setBackgroundSelected] = useState<string>('')
  const [edgeSelected, setEdgeSelected] = useState<string>('')
  const [hairHeightSelected, setHairHeightSelected] = useState<string>('')
  const [stampSelected, setStampSelected] = useState<string>('')
  const [colorSelected, setColorSelected] = useState<string>('')

  const [frontPhoto, setFrontPhoto] = useState<File>()
  const [backPhoto, setBackPhoto] = useState<File>()
  const [otherPhotos, setOtherPhotos] = useState<File[]>([])

  const [qtde, setQtde] = useState(1)

  const round = watch('round')
  const urgency = watch('urgency')

  const item = product

  const loading =
    loadingGetClient ||
    loadingHairHeights ||
    loadingStamps ||
    loadingEdges ||
    loadingBackgrounds ||
    loadingColors ||
    loadingDefects

  const isFromCart = !!item?.nanoid

  useEffect(() => {
    if (item) {
      setQtde(item.quantity ?? 1)
      setDefectsSelected(item.defects?.map((defect) => defect.name) ?? [])
      setBackgroundSelected(item.background ?? '')
      setEdgeSelected(item.edge ?? '')
      setHairHeightSelected(item.hairHeight ?? '')
      setStampSelected(item.stamp ?? '')
      setColorSelected(item.color ?? '')

      reset({
        round: item.round,
        diameter: String(item.diameter) ?? '',
        height: String(item.height) ?? '',
        width: String(item.width) ?? '',
        identification: item.identification ?? '',
        observation: item.observation ?? '',
        additionals: item.additionals?.map((additional) => ({
          name: additional.name,
          price: String(additional.price),
        })),
        urgency: item.urgency ?? false,
        urgencyDate: new Date(item.urgencyDate ?? new Date()),
        employeeOwner: {
          employeeId: String(employeeId) ?? '',
          productId: String(item.id),
        } as any,
      })
      append({
        name: '',
      } as any)
    }
  }, [append, item, reset, employeeId])

  const onSubmit = async (data: any) => {
    let finalPrice = item?.price ?? 0
    console.log('product', item)
    console.log('data', data)

    if (item?.type === 'tapete' && (!frontPhoto || !backPhoto)) {
      toast.error('Adicione a foto da frente e de trás do tapete')
      return
    }

    if (item?.type === 'tapete') {
      if (round) {
        const area = Math.PI * ((Number(data.diameter) ?? 0) / 2) ** 2
        finalPrice = finalPrice * area
      } else {
        finalPrice =
          finalPrice * (Number(data.height) ?? 0) * (Number(data.width) ?? 0)
      }
      finalPrice = Number(finalPrice?.toFixed(2))
    }

    const files = [frontPhoto, backPhoto, ...otherPhotos].filter(
      (a) => a !== undefined,
    ) as File[]

    const photosPromises = files.map((file) => {
      return convertToBase64(file)
    })

    const photos = (await Promise.all(photosPromises)).filter(
      (a) => a !== null,
    ) as string[] | null

    const productTemp = {
      ...item,
      nanoid: nanoid(),
      defects: defectsSelected.map((defect) => ({
        name: defect,
        description: '',
      })),
      additionals: data.additionals
        .filter((a: { name: string; price: number }) => a.name !== '')
        .map((additional: any) => ({
          name: additional.name,
          price: Number(additional.price),
        })),
      photos: photos ?? item?.photos,
      background: backgroundSelected,
      edge: edgeSelected,
      hairHeight: hairHeightSelected,
      stamp: stampSelected,
      color: colorSelected,
      quantity: qtde,
      identification: data.identification,
      observation: data.observation,
      diameter: data.diameter ? Number(data.diameter) : undefined,
      height: data.height ? Number(data.height) : undefined,
      width: data.width ? Number(data.width) : undefined,
      price: item?.price
        ? Number(Number(item?.price ?? 0).toFixed(2))
        : undefined,
      finalPrice,
      round: round,
      priceListId: item?.group?.priceListId,
      urgency,
      urgencyDate: urgency ? data.urgencyDate : undefined,
      employeeOwner: employeeId
        ? {
            employeeId,
            productId: item?.id,
          }
        : undefined,
    }
    console.log('productTemp', productTemp)

    if (!cart?.client && !tempCart?.client) {
      console.log('cart?.products?.length')

      mutateGetClient()
        .then((dataGetClient) => {
          addProduct(productTemp)
          toast.success('Item adicionado.')
          if (dataGetClient) addClient(dataGetClient)
          setProduct(undefined)
          if (isWashControl) setTab('7')
          else setTab('3')
        })
        .catch((error) => {
          toastErrorsApi(error)
        })
      if (isWashControl) setTab('7')
      else setTab('3')
    } else {
      if (isFromCart) {
        // update current product in cart by nanoid
        const productIndex = cart?.products?.findIndex(
          (p) => p.nanoid === item?.nanoid,
        )

        console.log(
          'cart?.products?.length',
          productIndex && productIndex !== -1 && !!cart?.products?.length,
        )

        if (
          productIndex !== undefined &&
          productIndex !== -1 &&
          cart?.products?.length
        ) {
          const productsTemp = [...cart?.products]
          productsTemp[productIndex] = productTemp
          setCart({
            ...cart,
            products: productsTemp,
          } as any)
        }

        toast.success('Item atualizado.')
        router.push('/rol/cart')
      } else {
        addProduct(productTemp)
        setProduct(undefined)
        toast.success('Item adicionado.')
        if (isWashControl) setTab('7')
        else setTab('3')
      }
    }
  }

  return (
    <>
      <div className="mt-6 flex w-full flex-col items-center gap-2">
        <TabsFunc isSearchable={false} />
        {loading && <Loading />}
        {/*<div className="mt-6 flex flex-col gap-1">*/}
        {/*  {item?.photos &&*/}
        {/*    item?.photos.map((photo) => (*/}
        {/*      <Image*/}
        {/*        key={photo}*/}
        {/*        src={photo}*/}
        {/*        alt={item?.name}*/}
        {/*        width={180}*/}
        {/*        height={180}*/}
        {/*        className="rounded-md"*/}
        {/*      />*/}
        {/*    ))}*/}
        {/*</div>*/}
        <div className="flex flex-col p-3">
          <span className="text-center font-bold text-default-700">
            {item?.name}
          </span>
          <span className="text-center text-sm text-default-500">
            {item?.description}
          </span>
          <span className="text-center">
            {formatBRL.format(Number(item?.price ?? 0))}
          </span>
        </div>

        <div className="flex max-w-xl flex-col">
          <form id="form-cart-product" onSubmit={handleSubmit(onSubmit)}>
            {item?.type === 'tapete' && (
              <div className="flex flex-wrap gap-2 rounded-md bg-content1 p-2">
                <Controller
                  name="round"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Skeleton className="rounded-md" isLoaded={!loading}>
                      <Switch
                        id={field.name}
                        name={field.name}
                        isSelected={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          if (value) {
                            setValue('height', '')
                            setValue('width', '')
                          } else {
                            setValue('diameter', '')
                          }
                        }}
                        color="primary"
                      >
                        <div className="flex">
                          <p className="text-medium">Redondo</p>
                        </div>
                      </Switch>
                    </Skeleton>
                  )}
                />
                <div className="grid w-full grid-cols-1 gap-8">
                  {!round && (
                    <>
                      <Controller
                        name="height"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) => {
                            if (Number(value) < 0)
                              return 'Altura não pode ser negativa'
                            if (Number(value) === 0)
                              return 'Altura não pode ser zero'
                            return true
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <Skeleton className="rounded-md" isLoaded={!loading}>
                            <Input
                              label="Altura em metros"
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
                              endContent={
                                <div className="pointer-events-none flex items-center">
                                  <span className="text-small text-default-400">
                                    m
                                  </span>
                                </div>
                              }
                            />
                          </Skeleton>
                        )}
                      />
                      <Controller
                        name="width"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) => {
                            if (Number(value) < 0)
                              return 'Largura não pode ser negativa'
                            if (Number(value) === 0)
                              return 'Largura não pode ser zero'
                            return true
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <Skeleton className="rounded-md" isLoaded={!loading}>
                            <Input
                              label="Largura em metros"
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
                              endContent={
                                <div className="pointer-events-none flex items-center">
                                  <span className="text-small text-default-400">
                                    m
                                  </span>
                                </div>
                              }
                            />
                          </Skeleton>
                        )}
                      />
                    </>
                  )}
                  {round && (
                    <Controller
                      name="diameter"
                      control={control}
                      defaultValue=""
                      rules={{
                        validate: (value) => {
                          if (Number(value) < 0)
                            return 'Diâmetro não pode ser negativo'
                          if (Number(value) === 0)
                            return 'Diâmetro não pode ser zero'
                          return true
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <Skeleton className="rounded-md" isLoaded={!loading}>
                          <Input
                            label="Diâmetro"
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
                            endContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-small text-default-400">
                                  m
                                </span>
                              </div>
                            }
                          />
                        </Skeleton>
                      )}
                    />
                  )}
                </div>
              </div>
            )}
            {item?.type === 'tapete' && (
              <Controller
                name="photos"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Skeleton className="rounded-md" isLoaded={!loading}>
                    <div className="flex w-full flex-col gap-2 p-2">
                      <span
                        className={
                          'text-primary transition-[transform,color,left,opacity] !duration-200 !ease-out'
                        }
                      >
                        Foto da frente
                        <span className={'text-sm text-danger'}>*</span>
                      </span>
                      <label className="flex h-full w-fit cursor-pointer flex-col justify-center rounded-md bg-default-100 px-3 py-2">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files) {
                              setFrontPhoto(e.target.files[0])
                            }
                          }}
                        />
                        <span>Enviar arquivo</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {frontPhoto && (
                          <Chip
                            isCloseable
                            onClose={() => {
                              setFrontPhoto(undefined)
                            }}
                            classNames={{
                              base: 'rounded-none bg-transparent mt-2 h-full px-0 items-start',
                              content: 'px-0',
                              closeButton: 'text-3xl ml-1',
                            }}
                          >
                            <Image
                              as={NextImage}
                              src={URL.createObjectURL(frontPhoto)}
                              width={150}
                              height={150}
                              alt={frontPhoto.name}
                              className={'rounded-md'}
                              isZoomed
                            />
                          </Chip>
                        )}
                      </div>

                      <span
                        className={
                          'text-primary transition-[transform,color,left,opacity] !duration-200 !ease-out'
                        }
                      >
                        Foto da trás
                        <span className={'text-sm text-danger'}>*</span>
                      </span>
                      <label className="flex h-full w-fit cursor-pointer flex-col justify-center rounded-md bg-default-100 px-3 py-2">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files) {
                              setBackPhoto(e.target.files[0])
                            }
                          }}
                        />
                        <span>Enviar arquivo</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {backPhoto && (
                          <Chip
                            isCloseable
                            onClose={() => {
                              setBackPhoto(undefined)
                            }}
                            classNames={{
                              base: 'rounded-none bg-transparent mt-2 h-full px-0 items-start',
                              content: 'px-0',
                              closeButton: 'text-3xl ml-1',
                            }}
                          >
                            <Image
                              as={NextImage}
                              src={URL.createObjectURL(backPhoto)}
                              width={150}
                              height={150}
                              alt={backPhoto.name}
                              className={'rounded-md'}
                              isZoomed
                            />
                          </Chip>
                        )}
                      </div>

                      <span
                        className={
                          'text-primary transition-[transform,color,left,opacity] !duration-200 !ease-out'
                        }
                      >
                        Outras fotos
                      </span>
                      <label className="flex h-full w-fit cursor-pointer flex-col justify-center rounded-md bg-default-100 px-3 py-2">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            if (e.target.files) {
                              setOtherPhotos(Array.from(e.target.files))
                            }
                          }}
                        />
                        <span>Enviar arquivo</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {otherPhotos.map((file) => (
                          <Chip
                            isCloseable
                            onClose={() => {
                              setOtherPhotos(
                                otherPhotos.filter((a) => a.name !== file.name),
                              )
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

                      {isFromCart && (
                        <div className="flex flex-wrap gap-2">
                          {item?.photos &&
                            item?.photos?.map((photo) => (
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
                                  className="cursor-pointer rounded-md"
                                  isZoomed
                                  onClick={() => {
                                    window.open(photo)
                                  }}
                                />
                              </Chip>
                            ))}
                        </div>
                      )}
                    </div>
                  </Skeleton>
                )}
              />
            )}
            {dataColors && (
              <div
                className={cn(
                  'flex gap-2',
                  'flex-wrap rounded-md bg-content1 p-2',
                )}
              >
                <RadioGroup
                  label="Cores"
                  value={colorSelected}
                  onValueChange={setColorSelected as any}
                >
                  {dataColors.map((color) => (
                    <Radio
                      key={color.name}
                      color="primary"
                      className="text-sm"
                      value={color.name}
                    >
                      {color.name}
                    </Radio>
                  ))}
                </RadioGroup>
              </div>
            )}
            {dataDefects && (
              <div
                className={cn(
                  'flex gap-2',
                  'flex-wrap rounded-md bg-content1 p-2',
                )}
              >
                <CheckboxGroup
                  label="Defeitos"
                  value={defectsSelected}
                  onValueChange={setDefectsSelected as any}
                >
                  {dataDefects.map((defect) => (
                    <Checkbox
                      key={defect.name}
                      color="primary"
                      className="text-sm"
                      value={defect.name}
                    >
                      {defect.name}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
            )}

            {item?.type === 'tapete' && (
              <>
                {dataBackgrounds && (
                  <div
                    className={cn(
                      'flex gap-2',
                      'flex-wrap rounded-md bg-content1 p-2',
                    )}
                  >
                    <RadioGroup
                      label="Fundos"
                      value={backgroundSelected}
                      onValueChange={setBackgroundSelected as any}
                    >
                      {dataBackgrounds.map((background) => (
                        <Radio
                          key={background.name}
                          color="primary"
                          className="text-sm"
                          value={background.name}
                        >
                          {background.name}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </div>
                )}
                {dataEdges && (
                  <div
                    className={cn(
                      'flex gap-2',
                      'flex-wrap rounded-md bg-content1 p-2',
                    )}
                  >
                    <RadioGroup
                      label="Bordas"
                      value={edgeSelected}
                      onValueChange={setEdgeSelected as any}
                    >
                      {dataEdges.map((edge) => (
                        <Radio
                          key={edge.name}
                          color="primary"
                          className="text-sm"
                          value={edge.name}
                        >
                          {edge.name}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </div>
                )}
                {dataHairHeights && (
                  <div
                    className={cn(
                      'flex gap-2',
                      'flex-wrap rounded-md bg-content1 p-2',
                    )}
                  >
                    <RadioGroup
                      label="Altura do pelo"
                      value={hairHeightSelected}
                      onValueChange={setHairHeightSelected as any}
                    >
                      {dataHairHeights.map((hairHeight) => (
                        <Radio
                          key={hairHeight.name}
                          color="primary"
                          className="text-sm"
                          value={hairHeight.name}
                        >
                          {hairHeight.name}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </div>
                )}
                {dataStamps && (
                  <div
                    className={cn(
                      'flex gap-2',
                      'flex-wrap rounded-md bg-content1 p-2',
                    )}
                  >
                    <RadioGroup
                      label="Estampas"
                      value={stampSelected}
                      onValueChange={setStampSelected as any}
                    >
                      {dataStamps.map((stamp) => (
                        <Radio
                          key={stamp.name}
                          color="primary"
                          className="text-sm"
                          value={stamp.name}
                        >
                          {stamp.name}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </>
            )}

            <div className="grid w-full grid-cols-1 gap-8 p-2">
              <Controller
                name="identification"
                control={control}
                defaultValue=""
                rules={{
                  required:
                    item?.type === 'tapete' ? 'Campo obrigatório' : false,
                }}
                render={({ field, fieldState: { error } }) => (
                  <Skeleton className="rounded-md" isLoaded={!loading}>
                    <Input
                      label="Identificação"
                      id={field.name}
                      type="text"
                      onChange={field.onChange}
                      name={field.name}
                      value={field.value}
                      variant="bordered"
                      color="primary"
                      isRequired={item?.type === 'tapete'}
                      isInvalid={!!error}
                      errorMessage={error?.message}
                    />
                  </Skeleton>
                )}
              />
              <Controller
                name="observation"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <Skeleton className="rounded-md" isLoaded={!loading}>
                    <Input
                      label="Observação"
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
            </div>
            <div className="grid w-full grid-cols-1 gap-8 p-2">
              <Controller
                name="urgency"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Skeleton className="rounded-md" isLoaded={!loading}>
                    <Switch
                      id={field.name}
                      name={field.name}
                      isSelected={field.value}
                      onValueChange={field.onChange}
                      color="primary"
                    >
                      <div className="flex">
                        <p className="text-medium">Urgência</p>
                      </div>
                    </Switch>
                  </Skeleton>
                )}
              />

              {urgency && (
                <Controller
                  name="urgencyDate"
                  control={control}
                  defaultValue={new Date()}
                  render={({ field }) => (
                    <Skeleton className="rounded-md" isLoaded={!loading}>
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
                            date.getTime() <
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
              )}
            </div>
            <div
              className={cn(
                'flex flex-col gap-2',
                'flex-wrap rounded-md bg-content1 p-2',
              )}
            >
              <span className="relative text-medium text-foreground-500">
                Adicionais
              </span>
              {fields.map((field, indexAdditional) => (
                <div
                  className="flex w-full items-center gap-1 md:gap-2"
                  key={field.id}
                >
                  <Controller
                    name={`additionals.${indexAdditional}.name`}
                    control={control}
                    defaultValue=""
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
                          isInvalid={!!error}
                          errorMessage={error?.message}
                        />
                      </Skeleton>
                    )}
                  />
                  <Controller
                    name={`additionals.${indexAdditional}.price`}
                    control={control}
                    defaultValue=""
                    render={({ field, fieldState: { error } }) => (
                      <Skeleton className="rounded-md" isLoaded={!loading}>
                        <Input
                          label="Valor"
                          id={field.name}
                          type="number"
                          onChange={field.onChange}
                          name={field.name}
                          value={field.value}
                          variant="bordered"
                          color="primary"
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
                      onClick={() => remove(indexAdditional)}
                      isDisabled={loading}
                      isIconOnly
                    >
                      <FaTrash size={20} className="text-white" />
                    </Button>
                  </Tooltip>
                </div>
              ))}

              <Button
                type="button"
                variant="bordered"
                color="primary"
                className="w-fit rounded-full data-[hover=true]:bg-main-200 data-[hover=true]:text-main-white "
                isDisabled={loading}
                onClick={() => {
                  append({
                    name: '',
                  } as any)
                }}
              >
                Adicionar
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <Button
          isIconOnly
          onClick={() => {
            if (qtde > 1) setQtde((q) => q - 1)
          }}
        >
          <FaMinus />
        </Button>
        <Input
          label="Quantidade"
          value={String(qtde)}
          id={'quantityProduct'}
          type="number"
          min={1}
          onChange={(e) => {
            if (isNaN(Number(e.target.value))) return
            if (Number(e.target.value) < 1) return
            setQtde(Number(e.target.value))
          }}
          classNames={{
            base: 'w-fit',
            // input: cn(
            //   '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none',
            //   '[&::-webkit-inner-spin-button]:appearance-none',
            // ),
          }}
        />
        <Button
          isIconOnly
          onClick={() => {
            setQtde((q) => q + 1)
          }}
        >
          <FaPlus />
        </Button>
      </div>

      <div className="mt-2 flex justify-between">
        <Button
          type="button"
          variant="flat"
          color="primary"
          className="w-fit"
          onClick={() => {
            if (tab === '2') setClientId(undefined)
            if (tab === '3') setPriceListId(undefined)
            setTab(String(Number(tab) - 1))
          }}
        >
          Voltar
        </Button>
        <Button
          type="submit"
          variant="flat"
          color="primary"
          className="w-fit"
          form="form-cart-product"
        >
          Adicionar ao carrinho
        </Button>
      </div>
    </>
  )
}

export default DetailsTab
