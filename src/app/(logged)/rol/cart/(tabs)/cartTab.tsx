'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { useRolHook } from '@/app/(logged)/rol/new/hook'
import {
  Accordion,
  AccordionItem,
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react'
import TabsFunc from '@/app/(logged)/rol/new/tabs'
import { formatBRL } from '@/utils/functions'
import {
  FaChevronDown,
  FaExclamationTriangle,
  FaMinus,
  FaPencilAlt,
  FaPlus,
  FaTrash,
} from 'react-icons/fa'
import React, { useEffect, useMemo, useState } from 'react'
import { RolProps } from '@/types/rol'
import { ProductRolProps } from '@/types/productRol'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import NextImage from 'next/image'
import { setTimeout } from '@wry/context'
import { putData, toastErrorsApi } from '@/utils/functions.api'
import { useMutation } from '@tanstack/react-query'
import { PutData } from '@/types'
import {
  calculatePrice,
  calculateTotalItemPrice,
} from '@/app/(logged)/rol/cart/(tabs)/functions'
import { useCart } from '@/app/(logged)/rol/cart/hook'
import { format } from 'date-fns'

const CartTab = () => {
  const {
    cart,
    removeProduct,
    setQuantity,
    setTotal,
    clearCart,
    isViewOnly,
    setProductTemp: setProduct,
  } = useCart()

  const { setTab, setClientId, setEditClient } = useRolHook()
  const router = useRouter()

  const hasId = useSearchParams().has('id')

  const { control } = useForm<RolProps>()

  useFieldArray({
    control,
    name: 'products',
  })

  const { mutateAsync: mutatePut, isPending: loadingPut } = useMutation({
    mutationFn: async (val: PutData<Partial<RolProps>>) =>
      putData<RolProps, Partial<RolProps>>(val),
    mutationKey: ['rol-put'],
  })

  const totalPrice = useMemo(() => {
    return (
      (cart?.products ?? [])
        .map((a) => ({
          price: Number(
            a.type === 'tapete' && !a.id ? a.finalPrice : a.price ?? 0,
          ),
          quantity: Number(a.quantity ?? 0),
        }))
        .reduce((a, b) => a + b.price * b.quantity, 0) ?? 0
    )
  }, [cart?.products])

  const totalAdditionals = useMemo(() => {
    return (
      (cart?.products ?? [])
        .map((a) => ({
          price: Number(
            a.additionals?.reduce((b, c) => (b ?? 0) + (c?.price ?? 0), 0) ?? 0,
          ),
          quantity: Number(a.quantity ?? 0),
        }))
        .reduce((a, b) => a + b.price * b.quantity, 0) ?? 0
    )
  }, [cart?.products])

  const total = useMemo(() => {
    return totalPrice + totalAdditionals
  }, [totalPrice, totalAdditionals])

  const itemsQuantity = useMemo(() => {
    return (
      (cart?.products ?? [])
        .map((a) => ({
          quantity: Number(a.quantity ?? 0),
        }))
        .reduce((a, b) => a + b.quantity, 0) ?? 0
    )
  }, [cart?.products])

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  useEffect(() => {
    if (total !== cart?.total) {
      setTotal(total)
    }
  }, [cart, setTotal, total])

  const handleSubimt = () => {
    const parseData = {
      id: undefined,
      clientId: cart?.client?.id,
      group: undefined,
      products: cart?.products?.map((product: any) => ({
        ...product,
        id: undefined,
        width: Number(product.width),
        height: Number(product.height),
        diameter: Number(product.diameter),
        defects: !!product.defects?.length ? product.defects : undefined,
        hairHeight: !!product.hairHeight?.length
          ? product.hairHeight
          : undefined,
        hairHeights: !!product.hairHeights?.length
          ? product.hairHeights
          : undefined,
        additionals: !!product.additionals?.length
          ? product.additionals
          : undefined,
        photos: undefined,
        price: Number(product.price),
      })),
      total: Number(cart?.total ?? 0),
    }
    if (cart?.id)
      mutatePut({
        url: '/rol',
        id: cart?.id,
        data: parseData,
      })
        .then(() => {
          toast.success('Rol atualizado com sucesso')
          setTimeout(() => {
            setTab('4')
          }, 1000)
        })
        .catch((error: any) => {
          toastErrorsApi(error)
        })
  }

  const disabled = useMemo(() => {
    return isViewOnly || (!!cart?.id && hasId)
  }, [cart?.id, hasId, isViewOnly])

  return (
    <div className="flex w-full flex-col gap-4">
      <TabsFunc cart={true} isSearchable={false} />
      <div className="flex items-center gap-4">
        <span className="">
          Cliente:{' '}
          <b>{cart?.client?.fantasyName ?? cart?.client?.corporateName}</b>
        </span>
        <Tooltip
          content="Alterar cliente"
          placement="bottom-end"
          className="text-white"
          color="primary"
          isDisabled={disabled}
        >
          <Button
            type="button"
            color="primary"
            className="w-fit scale-75 rounded-full text-main-white"
            onClick={() => {
              setClientId(cart?.clientId)
              setEditClient(true)
              setTab('1')
              router.push('/rol/new')
            }}
            isIconOnly
            isDisabled={disabled}
          >
            <FaPencilAlt size={16} className="text-white" />
          </Button>
        </Tooltip>
      </div>
      {cart?.products && (
        <Accordion
          selectionMode="multiple"
          aria-label="Produtos"
          selectedKeys={selectedKeys}
          // onSelectionChange={setSelectedKeys as }
        >
          {cart?.products?.map((item) => (
            <AccordionItem
              key={String(item.nanoid)}
              textValue={item.name}
              aria-label={item.name}
              title={
                <div className="flex items-center justify-between gap-1 p-2 md:gap-4">
                  <div className="flex w-full items-center justify-between gap-4 overflow-auto p-2">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`font-bold ${
                          item?.urgency ? 'underline decoration-red-300' : ''
                        }`}
                        title={item?.urgency ? 'Urgente' : ''}
                      >
                        {item.name}
                      </span>
                      {item.description && (
                        <small className="text-tiny text-default-400">
                          {item.description}
                        </small>
                      )}
                      {item.type === 'tapete' && (
                        <small className="text-tiny text-default-400">
                          {item.round
                            ? `${item.diameter}m`
                            : `${item.height}m x ${item.width}m`}
                        </small>
                      )}

                      {!!item.additionals?.length &&
                        item.additionals?.map((a) => (
                          <small
                            key={String(a?.name)}
                            className="text-tiny text-default-400"
                          >
                            {a?.name} -{' '}
                            {formatBRL.format(Number(a?.price ?? 0))}
                          </small>
                        ))}
                      <span className="text-sm">
                        Valor unitário:{' '}
                        {formatBRL.format(Number(calculatePrice(item as any)))}
                      </span>
                      <span className="text-sm">
                        Total com adicionais:{' '}
                        {formatBRL.format(
                          Number(calculateTotalItemPrice(item as any)),
                        )}
                      </span>
                    </div>
                    <div className="ml-1 flex h-16 items-center justify-center gap-2 p-1">
                      <Button
                        isIconOnly
                        onClick={() => {
                          if (item.id && item.quantity && item.quantity > 1) {
                            setQuantity(item.id, item.quantity - 1)
                          }
                        }}
                        className="h-unit-6 w-unit-4"
                        variant="faded"
                        isDisabled={disabled}
                      >
                        <FaMinus size={8} />
                      </Button>
                      <Input
                        value={String(item.quantity)}
                        onChange={(e) => {
                          if (isNaN(Number(e.target.value))) return
                          if (item.id) {
                            setQuantity(item.id, Number(e.target.value ?? 0))
                          }
                        }}
                        size="sm"
                        variant="faded"
                        classNames={{
                          base: 'w-[48px]',
                        }}
                        isDisabled={disabled}
                      />
                      <Button
                        isIconOnly
                        onClick={() => {
                          if (item.id && item.quantity) {
                            setQuantity(item.id, item.quantity + 1)
                          }
                        }}
                        className="h-unit-6 w-unit-4"
                        variant="faded"
                        isDisabled={disabled}
                      >
                        <FaPlus size={8} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Tooltip
                      content="Editar produto"
                      placement="bottom-end"
                      className="text-white"
                      color="primary"
                      isDisabled={disabled}
                    >
                      <Button
                        type="button"
                        color="primary"
                        className="w-fit rounded-full text-main-white"
                        onClick={() => {
                          if (item) {
                            setProduct(item as ProductRolProps<any>)
                            setTab('5')
                          }
                          router.push('/rol/new')
                        }}
                        isIconOnly
                        isDisabled={disabled}
                      >
                        <FaPencilAlt size={20} className="text-white" />
                      </Button>
                    </Tooltip>
                    <Tooltip
                      content="Remover do carrinho"
                      placement="bottom-end"
                      className="text-white"
                      color="danger"
                      isDisabled={disabled}
                    >
                      <Button
                        type="button"
                        color="danger"
                        className="w-fit rounded-full text-main-white"
                        onClick={() => {
                          if (item.nanoid) removeProduct(item.nanoid)
                        }}
                        isIconOnly
                        isDisabled={disabled}
                      >
                        <FaTrash size={20} className="text-white" />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              }
              classNames={{
                base: 'max-w-xl cursor-auto',
                title: 'cursor-auto',
              }}
              indicator={() => (
                <Button
                  type="button"
                  isIconOnly
                  variant="flat"
                  className="ml-2 w-fit"
                  radius="full"
                  onClick={() => {
                    if (selectedKeys.includes(item.nanoid ?? '')) {
                      setSelectedKeys(
                        selectedKeys.filter((a) => a !== item.nanoid),
                      )
                    } else {
                      setSelectedKeys([...selectedKeys, item.nanoid ?? ''])
                    }
                  }}
                >
                  <FaChevronDown title={'Expandir'} />
                </Button>
              )}
            >
              <div className="grid grid-cols-2 gap-1 px-6">
                {item?.urgency && item?.urgencyDate && (
                  <div className="my-2 flex flex-col">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <FaExclamationTriangle className="text-red-300" />
                      <span className="text-red-300">Urgente</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <small className="text-tiny text-default-400">
                        Prazo de entrega:{' '}
                        {format(item?.urgencyDate, 'dd/MM/yyyy HH:mm')}
                      </small>
                    </div>
                  </div>
                )}
                <div className="my-2 flex flex-col">
                  <span>Adicionais</span>
                  {item.additionals?.length ? (
                    <div className="flex flex-col gap-1">
                      {item.additionals?.map((a) => (
                        <small
                          key={String(a?.name)}
                          className="text-tiny text-default-400"
                        >
                          {a?.name} - {formatBRL.format(Number(a?.price ?? 0))}
                        </small>
                      ))}
                    </div>
                  ) : (
                    <span className="text-tiny text-default-400">
                      Nenhum adicional
                    </span>
                  )}
                </div>
                <div className="my-2 flex flex-col">
                  <span>Defeitos</span>
                  {item.defects?.length ? (
                    <div className="flex flex-col gap-1">
                      {item.defects?.map((a) => (
                        <small
                          key={String(a?.name)}
                          className="text-tiny text-default-400"
                        >
                          {a?.name}
                        </small>
                      ))}
                    </div>
                  ) : (
                    <span className="text-tiny text-default-400">
                      Nenhum defeito
                    </span>
                  )}
                </div>
                <div className="my-2 flex flex-col">
                  <span>Cor</span>
                  {item?.color ? (
                    <div className="flex flex-col gap-1">
                      <small className="text-tiny text-default-400">
                        {item?.color}
                      </small>
                    </div>
                  ) : (
                    <span className="text-tiny text-default-400">
                      Nenhuma cor selecionada
                    </span>
                  )}
                </div>
                {item?.type === 'tapete' && (
                  <>
                    {item?.photos?.length ? (
                      <div className="my-2 flex flex-col">
                        <span>Fotos</span>
                        <div className="flex flex-col gap-1">
                          {item?.photos?.map((photo) => (
                            <Image
                              key={photo}
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
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-tiny text-default-400">
                        Nenhuma foto
                      </span>
                    )}
                    {item?.background && (
                      <div className="my-2 flex flex-col">
                        <span>Fundo</span>
                        <div className="flex flex-col gap-1">
                          <small className="text-tiny text-default-400">
                            {item?.background}
                          </small>
                        </div>
                      </div>
                    )}
                    {item?.stamp && (
                      <div className="my-2 flex flex-col">
                        <span>Estampa</span>
                        <div className="flex flex-col gap-1">
                          <small className="text-tiny text-default-400">
                            {item?.stamp}
                          </small>
                        </div>
                      </div>
                    )}
                    {item?.hairHeight && (
                      <div className="my-2 flex flex-col">
                        <span>Altura de pelo</span>
                        <div className="flex flex-col gap-1">
                          <small className="text-tiny text-default-400">
                            {item?.hairHeight}
                          </small>
                        </div>
                      </div>
                    )}
                    {item?.edge && (
                      <div className="my-2 flex flex-col">
                        <span>Borda</span>
                        <div className="flex flex-col gap-1">
                          <small className="text-tiny text-default-400">
                            {item?.edge}
                          </small>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {item?.identification && (
                  <div className="my-2 flex flex-col">
                    <span>Identificação</span>
                    <div className="flex flex-col gap-1">
                      <small className="text-tiny text-default-400">
                        {item?.identification}
                      </small>
                    </div>
                  </div>
                )}
                {item?.observation && (
                  <div className="my-2 flex flex-col">
                    <span>Observação</span>
                    <div className="flex flex-col gap-1">
                      <small className="text-tiny text-default-400">
                        {item?.observation}
                      </small>
                    </div>
                  </div>
                )}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      <div className="mt-6">
        <Button
          type="button"
          variant="bordered"
          color="primary"
          className="w-fit rounded-full data-[hover=true]:bg-main-200 data-[hover=true]:text-main-white"
          isDisabled={isViewOnly}
          onClick={() => {
            if (cart?.id) {
              setClientId(cart?.clientId)
            } else setClientId(cart?.client?.id)
            setTab('2')
            router.push('/rol/new')
          }}
        >
          Adicionar produto
        </Button>
      </div>
      <div className="mt-6">
        <span className="mr-2 font-bold">Total</span>
        <span className="font-bold">
          {formatBRL.format(Number(total ?? 0))}
        </span>
      </div>
      <div className="mb-4">
        <span className="mr-2 text-tiny text-default-400">
          Quantidade de itens
        </span>
        <span className="text-tiny font-bold text-default-400">
          {itemsQuantity}
        </span>
      </div>
      {hasId && (
        <Button
          color="primary"
          variant="flat"
          className="w-fit"
          isDisabled={loadingPut || isViewOnly}
          onClick={() => {
            handleSubimt()
          }}
        >
          Atualizar
        </Button>
      )}
      {!hasId && (
        <div className="flex w-full justify-between">
          <Button
            color="primary"
            variant="flat"
            className="w-fit"
            onClick={() => {
              setTab('2')
            }}
          >
            Avançar
          </Button>
          <Button
            color="danger"
            variant="flat"
            className="w-fit"
            onClick={() => {
              onOpen()
            }}
          >
            Zerar carrinho
          </Button>
        </div>
      )}
      <Modal
        isOpen={isOpen}
        backdrop="opaque"
        classNames={{
          backdrop: 'blur-md',
        }}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="mt-4 flex flex-col gap-1">
                Tem certeza que limpar o carrinho?
              </ModalHeader>
              <ModalBody>
                <div className={'flex flex-col gap-2 text-default-600'}>
                  Você está prestes a zerar o carrinho, deseja continuar?
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Não
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    clearCart()
                    toast.success('Carrinho zerado com sucesso')
                    onClose()
                    router.push('/rol/new')
                  }}
                >
                  Sim
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default CartTab
