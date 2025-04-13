'use client'
import logo from '@/assets/images/logo.webp'
import { PostData } from '@/types'
import { delay } from '@/utils/functions'
import { postData, toastErrorsApi } from '@/utils/functions.api'
import { Button, Input } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import Loading from 'components/loading'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import '../style.css'

interface ChangePasswordFormProps {
  newPassword: string
  passwordConfirmation?: string
  token: string
}

const ChangePassword = () => {
  const { control, handleSubmit, getValues } =
    useForm<ChangePasswordFormProps>()

  const router = useRouter()

  const params = useSearchParams()
  const token = params.get('token')

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (val: PostData<ChangePasswordFormProps>) =>
      postData<any, ChangePasswordFormProps>(val),
    mutationKey: ['reset-password'],
    // onError: (error) => {
    //   toast.error(getErrorMessage(error))
    // },
  })

  const onSubmit = (form: ChangePasswordFormProps) => {
    mutateAsync({
      url: 'auth/reset-password-by-token',
      data: { newPassword: form.newPassword, token: token ?? '' },
    })
      .then(async () => {
        toast.success('Email enviado com sucesso')
        await delay(3000)
        router.push('/')
      })
      .catch((error) => {
        toastErrorsApi(error)
      })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-main to-main-white">
      {isPending && <Loading />}
      {!isPending && (
        <div className="rounded-md bg-main-200 p-10 shadow-sm  shadow-main-200 brightness-90 md:p-16 md:pt-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6 flex items-center justify-center">
              <Image alt="logo" src={logo} width={200} height={200} />
            </div>
            <h1 className="my-8 text-center text-xl font-bold">
              Redefinir senha
            </h1>
            <div className="mb-4">
              <Controller
                name="newPassword"
                control={control}
                defaultValue=""
                rules={{
                  validate: (value) => {
                    if (!value) return 'Campo obrigatório'
                    if (value.length < 6)
                      return 'A senha deve ter no mínimo 6 caracteres'
                    return true
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    type="password"
                    id={field.name}
                    name={field.name}
                    onChange={field.onChange}
                    value={field.value}
                    variant="underlined"
                    label="Nova senha"
                    disabled={isPending}
                    isInvalid={!!error}
                    errorMessage={error?.message}
                    classNames={{
                      label:
                        'text-white group-data-[filled-within=true]:text-white',
                    }}
                  />
                )}
              />
              <Controller
                name="passwordConfirmation"
                control={control}
                defaultValue=""
                rules={{
                  validate: (value) => {
                    if (!value) return 'Campo obrigatório'
                    if (value !== getValues('newPassword'))
                      return 'As senhas não coincidem'
                    return true
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    type="password"
                    id={field.name}
                    name={field.name}
                    onChange={field.onChange}
                    value={field.value}
                    variant="underlined"
                    label="Repetir senha"
                    disabled={isPending}
                    classNames={{
                      label:
                        'text-white group-data-[filled-within=true]:text-white',
                    }}
                    isInvalid={!!error}
                    errorMessage={error?.message}
                  />
                )}
              />
            </div>
            <div
              role="button"
              className="mb-6 text-sm italic text-white underline"
              onClick={() => router.back()}
            >
              Voltar
            </div>
            <div className="flex justify-center">
              <Button
                variant="bordered"
                type="submit"
                color="primary"
                className="loginAnim"
                disabled={isPending}
              >
                Enviar
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default ChangePassword
