'use client'
import logo from '@/assets/images/logo.webp'
import { useAuthState } from '@/hook/auth'
import { cookiesSettings, userErrors } from '@/utils/constants'
import { Button, Input } from '@nextui-org/react'
import Cookie from 'js-cookie'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import '../../../style.css'
import { useMutation, useQuery } from '@tanstack/react-query'
import { GetData, PostData } from '@/types'
import { getData, postData, toastErrorsApi } from '@/utils/functions.api'
import { AxiosApiError, LoginReturnProps, TokenProps } from '@/types/auth'
import { ClientTinturariaProps } from '@/types/clientTinturaria'
import { jwtDecode } from 'jwt-decode'
import { AxiosError } from 'axios'
import { maskCNPJ, maskCPF } from '@/utils/masks'
import { cnpjValidate, cpfValidate, onlyNumbers } from '@/utils/validations'
import Link from 'next/link'
import { OriginContactProps } from '@/types/originContact'
import { toast } from 'react-toastify'

interface LoginCleanerFormProps {
  cpfOrCnpj: string
}

const Login = () => {
  const { control, handleSubmit } = useForm<LoginCleanerFormProps>()

  const { setProfileCleaner, setSigned } = useAuthState()

  const redirect = decodeURIComponent(useSearchParams().get('redirect') || '')

  const router = useRouter()

  useEffect(() => {
    console.log(redirect)
  }, [redirect])

  const {
    data: dataGetClient,
    isPending: loadingGetClient,
    mutateAsync,
  } = useMutation({
    mutationFn: (val: LoginCleanerFormProps) =>
      getData<ClientTinturariaProps>({
        url: 'client/find-first/web',
        query: `where.OR[0].cnpj="${val.cpfOrCnpj}"&&where.OR[1].cpf="${val.cpfOrCnpj}"`,
      }),
    mutationKey: ['client-tinturaria-get'],
  })

  const onSubmit = (form: LoginCleanerFormProps) => {
    const parseData = {
      cpfOrCnpj: onlyNumbers(form.cpfOrCnpj ?? ''),
    }
    mutateAsync(parseData)
      .then(async (data) => {
        Cookie.set('cleanerSigned', 'true', cookiesSettings)
        toast.success('Login efetuado com sucesso.')
        setSigned(true)
        setProfileCleaner(data)
        if (redirect) router.push(redirect)
        else router.push('/tinturaria')
      })
      .catch((error: AxiosError<AxiosApiError<typeof userErrors>>) => {
        toastErrorsApi(error)
        setSigned(false)
      })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-main to-main-white">
      <div className="rounded-md bg-main-200 p-10 shadow-sm shadow-main-200 brightness-90 md:w-[500px] md:p-16 md:pt-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 flex items-center justify-center">
            <Image alt="logo" src={logo} width={200} height={200} />
          </div>
          <h1 className="my-8 text-center text-2xl font-bold">
            Tinturaria - Login
          </h1>
          <div className="mb-4">
            <Controller
              name="cpfOrCnpj"
              control={control}
              defaultValue=""
              rules={{
                maxLength: 18,
                validate: (value) => {
                  if (value.length === 14) {
                    if (!cpfValidate(value)) return 'CPF inválido'
                  } else {
                    if (!cnpjValidate(value)) return 'CNPJ inválido'
                  }
                  return true
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  type="text"
                  id={field.name}
                  name={field.name}
                  onChange={(e) => {
                    // create a mask for cpf or cnpj
                    const cpfOrCnpj = e.target.value

                    field.onChange(cpfOrCnpj)
                    if (cpfOrCnpj.length <= 14) {
                      field.onChange(maskCPF(cpfOrCnpj))
                    } else {
                      field.onChange(maskCNPJ(cpfOrCnpj))
                    }
                  }}
                  value={field.value}
                  variant="underlined"
                  label="CPF ou CNPJ"
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
          <div className="mb-8">
            <Link
              className="text-sm italic text-white underline"
              href="/tinturaria/registrar"
            >
              Criar conta
            </Link>
          </div>
          <div className="flex justify-center">
            <Button
              variant="bordered"
              type="submit"
              color="primary"
              className="loginAnim"
            >
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
