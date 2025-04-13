import React, { useEffect, useMemo, useRef, useState } from 'react'
import CanvasDraw from 'react-canvas-draw'
import TabsFunc from '@/app/(logged)/rol/new/tabs'
import {
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react'
import { FaTrash } from 'react-icons/fa'
import { Controller, useForm } from 'react-hook-form'
import { RolProps } from '@/types/rol'
import { postData, putData, toastErrorsApi } from '@/utils/functions.api'
import { useMutation } from '@tanstack/react-query'
import { PostData, PutData } from '@/types'
import { toast } from 'react-toastify'
import { defaultSignature } from '@/app/(logged)/rol/cart/constants'
import { useRolHook } from '@/app/(logged)/rol/new/hook'
import { setTimeout } from '@wry/context'
import { useCart } from '@/app/(logged)/rol/cart/hook'
import { useSearchParams } from 'next/navigation'
import { areProductsEqual } from '@/app/(logged)/rol/cart/(tabs)/functions'

const SignTab = () => {
  const canvasRef = useRef<any>(null)
  const { cart, tempCart, isViewOnly, setCart } = useCart()
  const { location, setTab } = useRolHook()
  const hasId = useSearchParams().has('id')

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [isVisible] = useState(false)

  const { control, handleSubmit, getValues, watch, setValue } =
    useForm<RolProps>()

  const {
    handleSubmit: handleSubmitCheckPassword,
    control: controlCheckPassword,
  } = useForm<{ password: string }>()

  const { mutateAsync: mutatePost, isPending: loadingPost } = useMutation({
    mutationFn: async (val: PostData<Partial<RolProps>>) =>
      postData<RolProps, Partial<RolProps>>(val),
    mutationKey: ['rol-post'],
  })
  const { mutateAsync: mutatePut, isPending: loadingPut } = useMutation({
    mutationFn: async (val: PutData<Partial<RolProps>>) =>
      putData<RolProps, Partial<RolProps>>(val),
    mutationKey: ['rol-put'],
  })

  const { mutateAsync: mutateCheckPassword, isPending: loadingCheckPassword } =
    useMutation({
      mutationFn: async (val: PostData<{ password: string }>) =>
        postData<{}, { password: string }>(val),
      mutationKey: ['check-password-post'],
    })

  const clearVaraContent = () => {
    const varaCont = document.getElementById('vara-cont')
    if (varaCont) {
      while (varaCont.firstChild) {
        varaCont.removeChild(varaCont.firstChild)
      }
    }
  }

  const onSubmit = async (data: Partial<RolProps>) => {
    let signature = canvasRef.current?.getDataURL('webp')

    if (signature === defaultSignature) {
      signature = undefined
    }

    const parseData = {
      ...data,
      id: undefined,
      launchSignature: signature,
      startSubscriberPhone: data.startSubscriberPhone?.replace(/\D/g, ''),
      clientId: cart?.client?.id,
      startLocation: location,
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
        photos: !!product.photos?.length ? product.photos : undefined,
        price: Number(product.price),
      })),
      os: !!data.os?.length ? data.os : undefined,
      observation: !!data.observation?.length ? data.observation : undefined,
      total: Number(Number(cart?.total ?? 0).toFixed(2)),
    }
    console.log(parseData)
    if (!tempCart?.id)
      mutatePost({
        url: '/rol',
        data: parseData,
      })
        .then((data) => {
          toast.success('Rol cadastrado com sucesso')
          setTimeout(() => {
            // clearCart()
            // router.push('/rol')
            setCart({
              ...cart,
              id: data.id,
              launchSignature: data.launchSignature,
            } as any)
            setTab('3')
          }, 1000)
        })
        .catch((error: any) => {
          toastErrorsApi(error)
        })
    else {
      // filter only changed values in cart compared to parseData
      const changedValues = Object.keys(parseData).reduce<Partial<RolProps>>(
        (acc, key) => {
          if (key === 'products') {
            if (
              !areProductsEqual(
                parseData.products ?? [],
                tempCart.products as any,
              )
            ) {
              acc.products = parseData.products
            }
          } else if (
            parseData[key as keyof RolProps] !== tempCart[key as keyof RolProps]
          ) {
            acc[key as keyof RolProps] = parseData[key as keyof RolProps]
          }
          return acc
        },
        {} as Partial<RolProps>,
      )

      console.log(cart)

      mutatePut({
        url: '/rol',
        id: tempCart?.id,
        data: changedValues,
      })
        .then(() => {
          toast.success('Rol atualizado com sucesso')
          setTimeout(() => {
            // clearCart()
            // router.push('/rol')
            setTab('3')
          }, 1000)
        })
        .catch((error: any) => {
          toastErrorsApi(error)
        })
    }
  }

  const checkPassword = ({ password }: { password: string }) => {
    mutateCheckPassword({
      url: '/auth/check-password',
      data: { password },
    })
      .then(() => {
        handleSubmit(onSubmit)()
        onClose()
      })
      .catch((error: any) => {
        toastErrorsApi(error)
      })
  }

  const loading = loadingPost || loadingCheckPassword || loadingPut

  const startSubscriberName = watch('startSubscriberName')

  useEffect(() => {
    // if (cart?.id) {
    setValue('startSubscriberName', cart?.startSubscriberName)
    setValue('startSubscriberPhone', cart?.startSubscriberPhone)
    setValue('observation', cart?.observation)
    // }
  }, [cart, setValue])

  const disabled = useMemo(() => {
    return isViewOnly || (!!cart?.id && hasId)
  }, [cart?.id, hasId, isViewOnly])

  return (
    <div className="flex w-full flex-col gap-4">
      <TabsFunc cart={true} isSearchable={false} />
      <div className="flex w-full flex-col items-center justify-center">
        <form
          id="formRol"
          className="w-[320px] xs:w-[360px] sm:w-[570px] md:w-[700px] lg:w-[900px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1>Dados de quem está entregando</h1>
          <div className="my-4 flex w-full flex-col gap-4">
            <Controller
              name="startSubscriberName"
              control={control}
              defaultValue={''}
              rules={{
                required: 'Campo obrigatório',
              }}
              render={({ field, fieldState: { error } }) => (
                <Skeleton className="rounded-md" isLoaded={!loading}>
                  <Input
                    label="Nome"
                    id={field.name}
                    type="text"
                    onChange={(e) => {
                      setCart({
                        ...cart,
                        startSubscriberName: e.target.value,
                      } as any)
                      field.onChange(e)
                    }}
                    name={field.name}
                    value={field.value}
                    isRequired
                    variant="bordered"
                    color="primary"
                    isInvalid={!!error}
                    errorMessage={error?.message}
                    isDisabled={disabled}
                  />
                </Skeleton>
              )}
            />
            <Controller
              name="startSubscriberPhone"
              control={control}
              defaultValue={cart?.client?.phone ?? ''}
              render={({ field, fieldState: { error } }) => (
                <Skeleton className="rounded-md" isLoaded={!loading}>
                  <Input
                    label="Telefone"
                    id={field.name}
                    type="text"
                    onChange={(e) => {
                      setCart({
                        ...cart,
                        startSubscriberPhone: e.target.value,
                      } as any)
                      field.onChange(e)
                    }}
                    name={field.name}
                    value={field.value}
                    variant="bordered"
                    color="primary"
                    isInvalid={!!error}
                    errorMessage={error?.message}
                    isDisabled={disabled}
                  />
                </Skeleton>
              )}
            />
            <Controller
              name="observation"
              control={control}
              defaultValue={''}
              render={({ field, fieldState: { error } }) => (
                <Skeleton className="rounded-md" isLoaded={!loading}>
                  <Input
                    label="Observação"
                    id={field.name}
                    type="text"
                    onChange={(e) => {
                      setCart({
                        ...cart,
                        observation: e.target.value,
                      } as any)
                      field.onChange(e)
                    }}
                    name={field.name}
                    value={field.value}
                    variant="bordered"
                    color="primary"
                    isInvalid={!!error}
                    errorMessage={error?.message}
                    isDisabled={disabled}
                  />
                </Skeleton>
              )}
            />
            <h1>Assinatura</h1>
          </div>
        </form>
        {!cart?.id && (
          <CanvasDraw
            className="border border-gray-300"
            canvasHeight={300}
            canvasWidth={900}
            brushRadius={1.5}
            brushColor="#000"
            lazyRadius={0}
            enablePanAndZoom
            hideGrid
            ref={canvasRef}
          />
        )}
        {cart?.id && (
          <Image
            alt="Assinatura"
            width={900}
            height={300}
            src={cart?.launchSignature}
            className="bg-white"
          />
        )}
        <div className="flex items-center justify-center gap-4">
          <Tooltip
            content="Limpar"
            placement="bottom"
            color="primary"
            classNames={{
              content: 'text-white bg-primary',
              arrow: 'bg-primary',
            }}
            isDisabled={!!cart?.id || isViewOnly}
          >
            <Button
              isIconOnly
              color="primary"
              className="mt-4 rounded-full text-white"
              onClick={() => {
                canvasRef.current?.clear()
                clearVaraContent()
              }}
              isDisabled={!!cart?.id || isViewOnly}
            >
              <FaTrash size={20} className="text-white" />
            </Button>
          </Tooltip>
        </div>
      </div>
      <Button
        type="button"
        variant="flat"
        color="primary"
        className="w-fit"
        // form="formRol"
        isDisabled={loading || !startSubscriberName || disabled}
        onClick={() => {
          if (!getValues('startSubscriberName')) {
            toast.error('Campo de nome é obrigatório')
            return
          }
          onOpen()
        }}
      >
        {cart?.id ? 'Atualizar rol' : 'Finalizar cadastro'}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmação de senha
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col gap-3"
                  onSubmit={handleSubmitCheckPassword(checkPassword)}
                >
                  <span>Confirme sua senha para lançar o Rol</span>
                  <Controller
                    name="password"
                    control={controlCheckPassword}
                    defaultValue={''}
                    rules={{
                      validate: (value) => {
                        if (!value) return 'Campo obrigatório'
                        if (value.length < 6)
                          return 'A senha deve ter no mínimo 6 caracteres'
                        return true
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <Skeleton className="rounded-md" isLoaded={!loading}>
                        <Input
                          label="Senha"
                          id={field.name}
                          onChange={(e) => {
                            field.onChange(e)
                          }}
                          name={field.name}
                          value={field.value}
                          isRequired
                          variant="bordered"
                          color="primary"
                          classNames={{
                            label:
                              'text-white group-data-[filled-within=true]:text-white',
                          }}
                          autoFocus
                          type={isVisible ? 'text' : 'password'}
                          isInvalid={!!error}
                          errorMessage={error?.message}
                        />
                      </Skeleton>
                    )}
                  />
                  <div className="mb-2 mt-3 flex w-full justify-end gap-2">
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Fechar
                    </Button>
                    <Button color="primary" type="submit">
                      Confirmar
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default SignTab
