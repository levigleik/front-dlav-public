'use client'
import Loading from 'components/loading'
import { getData, toastErrorsApi } from '@/utils/functions.api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRolTinturiaHook } from '../hook'
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
import { useCartTinturaria } from '@/app/(notlogged)/(cleaner)/tinturaria/(logged)/novo/carrinho/hook'
import { EmployeeProps } from '@/types/employee'

const DetailsTab = () => {
  const { tab, setTab, setPriceListId } = useRolTinturiaHook()
  const {
    addProduct,
    setCart,
    cart,
    productTemp: product,
    setProductTemp: setProduct,
  } = useCartTinturaria()

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

  const [qtde, setQtde] = useState(1)

  const round = watch('round')
  const urgency = watch('urgency')

  const item = product

  const isFromCart = !!item?.nanoid

  useEffect(() => {
    if (item) {
      setQtde(item.quantity ?? 1)

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
        employee: !!item.employeeOwner,
        employeeOwner: {
          employeeId: String(item.employeeOwner?.employeeId) ?? '',
          productId: String(item.id),
        } as any,
      })
      append({
        name: '',
      } as any)
    }
  }, [append, item, reset])

  const onSubmit = async (data: any) => {
    let finalPrice = item?.price ?? 0
    console.log('product', item)
    console.log('data', data)

    const productTemp = {
      ...item,
      nanoid: nanoid(),
      // defect: defectsSelected.map((defect) => ({
      //   name: defect,
      //   description: '',
      // })),
      additionals: data.additionals
        .filter((a: { name: string; price: number }) => a.name !== '')
        .map((additional: any) => ({
          name: additional.name,
          price: Number(additional.price),
        })),
      // background: backgroundSelected,
      // edge: edgeSelected,
      // hairHeight: hairHeightSelected,
      // stamp: stampSelected,
      // color: colorSelected,
      quantity: qtde,
      identification: data.identification,
      observation: data.observation,
      diameter: data.diameter ? Number(data.diameter) : undefined,
      height: data.height ? Number(data.height) : undefined,
      width: data.width ? Number(data.width) : undefined,
      price: item?.price ? Number(item?.price) : undefined,
      finalPrice,
      round: round,
      priceListId: item?.group?.priceListId,
      urgency,
      urgencyDate: urgency ? data.urgencyDate : undefined,
      employee: undefined,
    }
    console.log('productTemp', productTemp)

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
        console.log('products', productsTemp)
        console.log('productIndex', productIndex)
        setCart({
          ...cart,
          products: productsTemp,
        } as any)
      }

      toast.success('Item atualizado.')
      router.push('/tinturaria/novo/carrinho')
    } else {
      addProduct(productTemp)
      setProduct(undefined)
      toast.success('Item adicionado.')
      setTab('1')
    }
  }

  return (
    <>
      <div className="mt-6 flex w-full flex-col items-center gap-2">
        <TabsFunc isSearchable={false} />
        {/*{loading && <Loading />}*/}
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
                )}
              />
              <Controller
                name="observation"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
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
                )}
              />
            </div>
            <div className="grid w-full grid-cols-1 gap-8 p-2">
              <Controller
                name="urgency"
                control={control}
                defaultValue={false}
                render={({ field }) => (
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
                )}
              />

              {urgency && (
                <Controller
                  name="urgencyDate"
                  control={control}
                  defaultValue={new Date()}
                  render={({ field }) => (
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
                    )}
                  />
                  <Controller
                    name={`additionals.${indexAdditional}.price`}
                    control={control}
                    defaultValue=""
                    render={({ field, fieldState: { error } }) => (
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
                onClick={() => {
                  append({
                    name: '',
                  } as any)
                }}
              >
                Adicionar
              </Button>
            </div>
            {/*<div className="grid w-full grid-cols-1 gap-8 p-2">*/}
            {/*  <Controller*/}
            {/*    name="employee"*/}
            {/*    control={control}*/}
            {/*    defaultValue={false}*/}
            {/*    render={({ field }) => (*/}
            {/*      <Skeleton className="rounded-md" isLoaded={!loading}>*/}
            {/*        <Switch*/}
            {/*          id={field.name}*/}
            {/*          name={field.name}*/}
            {/*          isSelected={field.value}*/}
            {/*          onValueChange={field.onChange}*/}
            {/*          color="primary"*/}
            {/*        >*/}
            {/*          <div className="flex">*/}
            {/*            <p className="text-medium">Empregado</p>*/}
            {/*          </div>*/}
            {/*        </Switch>*/}
            {/*      </Skeleton>*/}
            {/*    )}*/}
            {/*  />*/}
            {/*</div>*/}
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
