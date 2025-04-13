'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
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
import { LocationProps, RolFinishProps, RolProps } from '@/types/rol'
import { postData, putData, toastErrorsApi } from '@/utils/functions.api'
import { useMutation } from '@tanstack/react-query'
import { PostData, PutData } from '@/types'
import { toast } from 'react-toastify'
import { defaultSignature } from '@/app/(logged)/rol/cart/constants'
import { setTimeout } from '@wry/context'
import { useParams, useRouter } from 'next/navigation'

const SignTab = () => {
  const canvasRef = useRef<any>(null)
  const { id } = useParams<{ id: string }>()

  const router = useRouter()

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const [location, setLocation] = useState<LocationProps>()

  const [isVisible] = useState(false)

  const { control, handleSubmit, getValues, watch, setValue } =
    useForm<RolFinishProps>()

  const {
    handleSubmit: handleSubmitCheckPassword,
    control: controlCheckPassword,
  } = useForm<{ password: string }>()

  const { mutateAsync: mutatePut, isPending: loadingPut } = useMutation({
    mutationFn: async (val: PutData<Partial<RolFinishProps>>) =>
      putData<RolFinishProps, Partial<RolFinishProps>>(val),
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
      finishLocation: location,
      finalSignature: signature,
    }

    mutatePut({
      id: Number(id),
      data: parseData,
      fullUrl: `/rol/${id}/cancel`,
    })
      .then((data) => {
        toast.success('Rol finalizado com sucesso')
        setTimeout(() => {
          // clearCart()
          router.push('/worker')
        }, 1000)
      })
      .catch((error: any) => {
        toastErrorsApi(error)
      })
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

  const loading = loadingCheckPassword || loadingPut

  const finalSubscriberName = watch('finalSubscriberName')

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error('Localização não suportada no seu navegador')
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: String(position.coords.latitude),
            longitude: String(position.coords.longitude),
          })
        },
        () => {
          toast.error('Não foi possível obter a localização')
        },
      )
    }
  }, [setLocation])

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col items-center justify-center">
        <form
          id="formRol"
          className="w-[320px] xs:w-[360px] sm:w-[570px] md:w-[700px] lg:w-[900px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1>Assinatura de quem está recebendo</h1>
          <div className="my-4 flex w-full flex-col gap-4">
            <Controller
              name="finalSubscriberName"
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
                      field.onChange(e)
                    }}
                    name={field.name}
                    value={field.value}
                    isRequired
                    variant="bordered"
                    color="primary"
                    isInvalid={!!error}
                    errorMessage={error?.message}
                  />
                </Skeleton>
              )}
            />
            <Controller
              name="finalSubscriberPhone"
              control={control}
              defaultValue=""
              render={({ field, fieldState: { error } }) => (
                <Skeleton className="rounded-md" isLoaded={!loading}>
                  <Input
                    label="Telefone"
                    id={field.name}
                    type="text"
                    onChange={(e) => {
                      field.onChange(e)
                    }}
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
                      field.onChange(e)
                    }}
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
        </form>
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
        <div className="flex items-center justify-center gap-4">
          <Tooltip
            content="Limpar"
            placement="bottom"
            color="primary"
            classNames={{
              content: 'text-white bg-primary',
              arrow: 'bg-primary',
            }}
          >
            <Button
              isIconOnly
              color="primary"
              className="mt-4 rounded-full text-white"
              onClick={() => {
                canvasRef.current?.clear()
                clearVaraContent()
              }}
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
        isDisabled={loading}
        onClick={() => {
          onOpen()
        }}
      >
        Finalizar rol
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
