'use client'
import logo from '@/assets/images/logo.webp'
import { PostData } from '@/types'
import { delay } from '@/utils/functions'
import { postData, toastErrorsApi } from '@/utils/functions.api'
import { Button, Input } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import Loading from 'components/loading'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import '../style.css'

interface ResetPasswordFormProps {
  email: string
}

const ResetPassword = () => {
  const { control, handleSubmit } = useForm<ResetPasswordFormProps>()

  const router = useRouter()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (val: PostData<ResetPasswordFormProps>) =>
      postData<any, ResetPasswordFormProps>(val),
    mutationKey: ['reset-password'],
    // onError: (error) => {
    //   toast.error(getErrorMessage(error))
    // },
  })

  const onSubmit = (form: ResetPasswordFormProps) => {
    mutateAsync({
      url: 'auth/send-password-reset-email',
      data: form,
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
              Confirme seu email para redefinir sua senha
            </h1>
            <div className="mb-4">
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  validate: (email) => {
                    if (!email) return 'Email é obrigatório'
                    if (
                      !email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
                    )
                      return 'Email inválido'
                    return true
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    type="text"
                    id={field.name}
                    name={field.name}
                    onChange={field.onChange}
                    value={field.value}
                    variant="underlined"
                    label="Email"
                    disabled={isPending}
                    isRequired
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
              onClick={() => router.push('/login')}
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

export default ResetPassword
