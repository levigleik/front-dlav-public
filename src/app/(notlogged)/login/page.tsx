'use client'
import logo from '@/assets/images/logo.webp'
import { useAuthState } from '@/hook/auth'
import { PostData } from '@/types'
import { AxiosApiError, LoginReturnProps, TokenProps } from '@/types/auth'
import { cookiesSettings, userErrors } from '@/utils/constants'
import { postData, toastErrorsApi } from '@/utils/functions.api'
import { Button, Input } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import Loading from 'components/loading'
import Cookie from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import '../style.css'

interface LoginFormProps {
  userName: string
  password: string
}

const Login = () => {
  const { control, handleSubmit } = useForm<LoginFormProps>()

  const [isVisible, setIsVisible] = useState(false)
  const { setProfile, setSigned } = useAuthState()

  const redirect = decodeURIComponent(useSearchParams().get('redirect') || '')

  const router = useRouter()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (val: PostData<LoginFormProps>) =>
      postData<LoginReturnProps, LoginFormProps>(val),
    mutationKey: ['login'],
  })

  useEffect(() => {
    console.log(redirect)
  }, [redirect])
  const toggleVisibility = () => setIsVisible((v) => !v)

  const onSubmit = (form: LoginFormProps) => {
    mutateAsync({
      url: 'auth/login',
      data: form,
    })
      .then(async (data) => {
        const { exp } = jwtDecode<TokenProps>(data.idToken)
        const expiresIn = new Date(exp * 1000).toString()

        Cookie.set('idToken', data.idToken, cookiesSettings)
        Cookie.set('refreshToken', data.refreshToken, cookiesSettings)
        Cookie.set('expiresIn', expiresIn, cookiesSettings)
        Cookie.set('role', data.user.role, cookiesSettings)
        Cookie.set('signed', 'true', cookiesSettings)

        setSigned(true)
        setProfile(data.user)
        if (redirect) router.push(redirect)
        else router.push('/')
      })
      .catch((error: AxiosError<AxiosApiError<typeof userErrors>>) => {
        toastErrorsApi(error)
        setSigned(false)
      })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-main to-main-white">
      {isPending && <Loading />}
      {!isPending && (
        <div className="rounded-md bg-main-200 p-10 shadow-sm shadow-main-200 brightness-90 md:w-[500px] md:p-16 md:pt-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6 flex items-center justify-center">
              <Image alt="logo" src={logo} width={200} height={200} />
            </div>
            <h1 className="my-8 text-center text-2xl font-bold">Login</h1>
            <div className="mb-4">
              <Controller
                name="userName"
                control={control}
                defaultValue=""
                rules={{ required: 'Campo obrigatório' }}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    type="text"
                    id={field.name}
                    name={field.name}
                    onChange={field.onChange}
                    value={field.value}
                    variant="underlined"
                    label="Usuário"
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
            <div className="mb-6">
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{ required: 'Campo obrigatório' }}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    label="Senha"
                    variant="underlined"
                    id={field.name}
                    onChange={field.onChange}
                    name={field.name}
                    value={field.value}
                    disabled={isPending}
                    isInvalid={!!error}
                    errorMessage={error?.message}
                    classNames={{
                      label:
                        'text-white group-data-[filled-within=true]:text-white',
                    }}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <FaEye className="pointer-events-none text-2xl text-white" />
                        ) : (
                          <FaEyeSlash className="pointer-events-none text-2xl text-white" />
                        )}
                      </button>
                    }
                    type={isVisible ? 'text' : 'password'}
                  />
                )}
              />
            </div>
            <div className="mb-8">
              <Link
                className="text-sm italic text-white underline"
                href="/reset-password"
              >
                Esqueceu sua senha?
              </Link>
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

export default Login
