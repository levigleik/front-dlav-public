import React, { useEffect, useMemo, useRef, useState } from 'react'
import CanvasDraw from 'react-canvas-draw'
import TabsFunc from '@/app/(logged)/rol/new/tabs'
import {
  Button,
  cn,
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
import { FaFont, FaTrash } from 'react-icons/fa'
import Vara from 'vara'
import { Controller, useForm } from 'react-hook-form'
import { RolProps } from '@/types/rol'
import { postData, putData, toastErrorsApi } from '@/utils/functions.api'
import { useMutation } from '@tanstack/react-query'
import { PostData, PutData } from '@/types'
import toImg from 'react-svg-to-image'
import { toast } from 'react-toastify'
import { defaultSignature } from '@/app/(logged)/rol/cart/constants'
import { setTimeout } from '@wry/context'
import { useCartTinturaria } from '@/app/(notlogged)/(cleaner)/tinturaria/(logged)/novo/carrinho/hook'
import { useSearchParams } from 'next/navigation'
import { areProductsEqual } from '@/app/(logged)/rol/cart/(tabs)/functions'
import { useRolTinturiaHook } from '@/app/(notlogged)/(cleaner)/tinturaria/(logged)/novo/(new)/hook'

const SignTab = () => {
  const [showVara, setShowVara] = useState(false)
  const canvasRef = useRef<any>(null)
  const { cart, tempCart, isViewOnly, setCart } = useCartTinturaria()
  const { location, setTab } = useRolTinturiaHook()

  const hasId = useSearchParams().has('id')

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [isVisible] = useState(false)

  const { control, handleSubmit, getValues, watch, setValue } =
    useForm<RolProps>()

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

  const removeAccents = (text: string) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }
  const handleVara = async (text: string) => {
    setShowVara(true)
    return new Promise((resolve, reject) => {
      resolve(
        new Vara('#vara-cont', '../satisfy.json', [
          {
            text: removeAccents(text),
            fontSize: 40,
            strokeWidth: 1.3,
            x: 10,
            y: 10,
            duration: 1000,
          },
        ]),
      )
    })
  }

  const clearVaraContent = () => {
    const varaCont = document.getElementById('vara-cont')
    if (varaCont) {
      while (varaCont.firstChild) {
        varaCont.removeChild(varaCont.firstChild)
      }
    }
  }

  const setVaraSignature = async () => {
    let signature
    const varaElement = document.getElementById('vara-cont')
    if (varaElement) {
      const svg = varaElement.querySelector('svg')
      if (svg) {
        try {
          signature = await toImg('#vara-cont>svg', 'signature', {
            download: false,
            quality: 0.7,
            format: 'webp',
          })
        } catch (error) {
          toast.error('Erro ao salvar assinatura')
        }
      }
    }
    return signature
  }

  const onSubmit = async (data: Partial<RolProps>) => {
    let signature = canvasRef.current?.getDataURL('webp')

    if (signature === defaultSignature) {
      signature = undefined
    }
    if (showVara) {
      signature = await setVaraSignature()
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
      total: Number(cart?.total ?? 0),
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

  const checkPassword = () => {
    mutateCheckPassword({
      url: '/auth/check-password',
      data: { password: passwordConfirmation },
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
              defaultValue={''}
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
          </div>
        </form>
        {!cart?.id && (
          <>
            <div
              id="vara-cont"
              className={cn(
                'h-[300px] w-[320px] border border-gray-300 bg-white',
                'xs:w-[360px] sm:w-[570px] md:w-[700px] lg:w-[900px]',
                `${showVara ? '' : 'hidden'}`,
              )}
            />
            {!showVara && (
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
          </>
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
                setShowVara(false)
                canvasRef.current?.clear()
                clearVaraContent()
              }}
              isDisabled={!!cart?.id || isViewOnly}
            >
              <FaTrash size={20} className="text-white" />
            </Button>
          </Tooltip>
          <Tooltip
            content="Assinar"
            placement="bottom"
            color="primary"
            classNames={{
              content: 'text-white bg-primary',
              arrow: 'bg-primary',
            }}
            isDisabled={isViewOnly}
          >
            <Button
              isIconOnly
              color="primary"
              className="mt-4 rounded-full text-white"
              isDisabled={!startSubscriberName || !!cart?.id || isViewOnly}
              onClick={() => {
                if (showVara) clearVaraContent()
                handleVara(startSubscriberName || '')
              }}
            >
              <FaFont size={20} className="text-white" />
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
                <span>Confirme sua senha para lançar o Rol</span>
                <Input
                  label="Senha"
                  variant="bordered"
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  value={passwordConfirmation}
                  disabled={loading}
                  classNames={{
                    label:
                      'text-white group-data-[filled-within=true]:text-white',
                  }}
                  autoFocus
                  // endContent={
                  //   <button
                  //     className="focus:outline-none"
                  //     type="button"
                  //     onClick={toggleVisibility}
                  //   >
                  //     {isVisible ? (
                  //       <FaEye className="pointer-events-none text-2xl text-white" />
                  //     ) : (
                  //       <FaEyeSlash className="pointer-events-none text-2xl text-white" />
                  //     )}
                  //   </button>
                  // }
                  type={isVisible ? 'text' : 'password'}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Fechar
                </Button>
                <Button color="primary" onPress={checkPassword}>
                  Confirmar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default SignTab
