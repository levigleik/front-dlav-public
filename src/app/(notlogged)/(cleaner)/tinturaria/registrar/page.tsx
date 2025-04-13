'use client'
import { getCEP } from '@/app/(logged)/client/[id]/functions'
import { PostData } from '@/types'
import { ClientProps } from '@/types/client'
import { ClientBranchProps } from '@/types/clientBranch'
import { OriginContactProps } from '@/types/originContact'
import { getData, postData, toastErrorsApi } from '@/utils/functions.api'
import { maskCEP, maskCNPJ, maskCPF } from '@/utils/masks'
import { cnpjValidate, cpfValidate, onlyNumbers } from '@/utils/validations'
import { Button, Input, Select, SelectItem, Skeleton } from '@nextui-org/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Row } from 'components/grid/row'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { ClientFormProps } from './types'

const ClientEdit = () => {
  const { id } = useParams<{ id: string | 'new' }>()
  const router = useRouter()

  const { data: dataGetClient, isLoading: loadingGet } = useQuery({
    queryFn: ({ signal }) =>
      getData<ClientProps>({
        url: 'client',
        id: parseInt(id, 10),
        signal,
        query:
          'include.address=true&&include.branch=true&&include.originContact=true',
      }),
    queryKey: ['client-get', id],
    enabled: id !== 'new',
  })

  const { mutateAsync: mutatePost, isPending: loadingPost } = useMutation({
    mutationFn: async (val: PostData<ClientProps>) =>
      postData<ClientProps, ClientProps>(val),
    mutationKey: ['client-post'],
  })

  const { mutateAsync: mutateGetCEP, isPending: loadingCEP } = useMutation({
    mutationFn: async (val: string) => getCEP(val),
    mutationKey: ['cep-get'],
  })

  const { data: dataGetOriginContact, isLoading: loadingGetOriginContact } =
    useQuery({
      queryFn: ({ signal }) =>
        getData<OriginContactProps<any>[]>({
          url: 'originContact',
          signal,
        }),
      queryKey: ['origin-contact-get'],
      refetchOnMount: false,
      refetchOnReconnect: false,
    })

  const { handleSubmit, setValue, control, reset } = useForm<
    ClientFormProps,
    'clients'
  >()

  const onSubmit = (data: ClientFormProps) => {
    const parseData = {
      ...data,
      address: {
        ...data.address,
        zipCode: onlyNumbers(data.address.zipCode ?? ''),
        country: 'Brasil',
      },
      cnpj: data.cnpj ? onlyNumbers(data.cnpj ?? '') : undefined,
      phone: data.phone ? onlyNumbers(data.phone ?? '') : undefined,
      ownerCPF: data.ownerCPF ? onlyNumbers(data.ownerCPF ?? '') : undefined,
      originContactId: data.originContactId
        ? Number(data.originContactId)
        : undefined,
      branchId: data.branchId ? Number(data.branchId) : undefined,
    } as any
    mutatePost({
      url: '/client/web',
      data: parseData,
    })
      .then(() => {
        toast.success('Cliente cadastrado com sucesso')
        setTimeout(() => {
          router.push('/tinturaria')
        }, 1000)
        reset()
      })
      .catch((error: any) => {
        toastErrorsApi(error)
      })
  }

  const loading = loadingGet || loadingPost || loadingGetOriginContact

  useEffect(() => {
    if (dataGetClient && id !== 'new') {
      setValue('fantasyName', dataGetClient.fantasyName)
      setValue('cnpj', maskCNPJ(dataGetClient.cnpj ?? ''))
      setValue('address', {
        ...dataGetClient.address,
        zipCode: maskCEP(dataGetClient.address?.zipCode ?? ''),
      })
      setValue('email', dataGetClient.email)
      setValue('phone', dataGetClient.phone)
      setValue('ownerName', dataGetClient.ownerName)
      setValue('ownerCPF', maskCPF(dataGetClient.ownerCPF ?? ''))
      setValue('originContactId', String(dataGetClient.originContactId ?? 3))
      setValue('branchId', String(dataGetClient.branchId))
    }
  }, [dataGetClient, id, setValue])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-md p-10 shadow-sm shadow-main-200 brightness-90 md:p-16 md:pt-8">
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <h1 className="mb-6 text-center text-2xl font-bold">
            Cadastro do cliente
          </h1>
          <Row>
            <Controller
              name="fantasyName"
              control={control}
              defaultValue=""
              rules={{ required: 'Campo obrigatório' }}
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
                    isRequired
                    isInvalid={!!error}
                    errorMessage={error?.message}
                  />
                </Skeleton>
              )}
            />
            <Controller
              name="cnpj"
              control={control}
              defaultValue=""
              rules={{
                validate: (value) => {
                  if (!value) return 'Campo obrigatório'
                  if (!cnpjValidate(onlyNumbers(value))) return 'CNPJ inválido'
                  return true
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Skeleton className="rounded-md" isLoaded={!loading}>
                  <Input
                    label="CNPJ"
                    id={field.name}
                    type="text"
                    onChange={(val) =>
                      field.onChange(maskCNPJ(val.target.value))
                    }
                    name={field.name}
                    value={field.value}
                    variant="bordered"
                    color="primary"
                    isRequired
                    isInvalid={!!error}
                    errorMessage={error?.message}
                  />
                </Skeleton>
              )}
            />
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field, fieldState: { error } }) => (
                <Skeleton className="rounded-md" isLoaded={!loading}>
                  <Input
                    label="Email"
                    id={field.name}
                    type="email"
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
              name="phone"
              control={control}
              defaultValue=""
              render={({ field, fieldState: { error } }) => (
                <Skeleton className="rounded-md" isLoaded={!loading}>
                  <Input
                    label="Telefone"
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
              name="ownerName"
              control={control}
              defaultValue=""
              render={({ field, fieldState: { error } }) => (
                <Skeleton className="rounded-md" isLoaded={!loading}>
                  <Input
                    label="Nome do administrador"
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
              name="ownerCPF"
              control={control}
              defaultValue=""
              rules={{
                validate: (value) => {
                  if (!value) return true
                  if (!cpfValidate(onlyNumbers(value))) return 'CPF inválido'
                  return true
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Skeleton className="rounded-md" isLoaded={!loading}>
                  <Input
                    label="CPF do aniministrador"
                    id={field.name}
                    type="text"
                    onChange={(val) =>
                      field.onChange(maskCPF(val.target.value))
                    }
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
              name="originContactId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Skeleton className="rounded-md" isLoaded={!loading}>
                  <Select
                    label="Como você conheceu a empresa?"
                    id={field.name}
                    onChange={field.onChange}
                    name={field.name}
                    selectedKeys={field.value ? [field.value] : new Set([])}
                    variant="bordered"
                    color="primary"
                    isInvalid={!!error}
                    errorMessage={error?.message}
                    classNames={{
                      value: 'text-foreground',
                    }}
                    items={dataGetOriginContact ?? []}
                    isLoading={loadingGetOriginContact}
                  >
                    {(item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    )}
                  </Select>
                </Skeleton>
              )}
            />
            <Controller
              name={'address.zipCode'}
              control={control}
              defaultValue=""
              rules={{ required: 'Campo obrigatório' }}
              render={({ field, fieldState: { error } }) => (
                <Skeleton className="rounded-md" isLoaded={!loading}>
                  <Input
                    label="CEP"
                    id={field.name}
                    type="text"
                    onChange={(val) => {
                      field.onChange(maskCEP(val.target.value))
                      if (val.target.value.length === 9) {
                        mutateGetCEP(val.target.value).then((data) => {
                          setValue('address.city', data.localidade)
                          setValue('address.state', data.uf)
                          setValue('address.publicArea', data.logradouro)
                          setValue('address.number', data.complemento)
                          setValue('address.neighborhood', data.bairro)
                        })
                      }
                    }}
                    name={field.name}
                    value={field.value}
                    variant="bordered"
                    color="primary"
                    isRequired
                    isInvalid={!!error}
                    errorMessage={error?.message}
                  />
                </Skeleton>
              )}
            />
            <Controller
              name="address.state"
              control={control}
              defaultValue=""
              rules={{ required: 'Campo obrigatório' }}
              render={({ field, fieldState: { error } }) => (
                <Skeleton
                  className="rounded-md"
                  isLoaded={!(loadingCEP || loading)}
                >
                  <Input
                    label="Estado"
                    id={field.name}
                    type="text"
                    onChange={field.onChange}
                    name={field.name}
                    value={field.value}
                    variant="bordered"
                    color="primary"
                    isRequired
                    isInvalid={!!error}
                    errorMessage={error?.message}
                  />
                </Skeleton>
              )}
            />
            <Controller
              name="address.city"
              control={control}
              defaultValue=""
              rules={{ required: 'Campo obrigatório' }}
              render={({ field, fieldState: { error } }) => (
                <Skeleton
                  className="rounded-md"
                  isLoaded={!(loadingCEP || loading)}
                >
                  <Input
                    label="Cidade"
                    id={field.name}
                    type="text"
                    onChange={field.onChange}
                    name={field.name}
                    value={field.value}
                    variant="bordered"
                    color="primary"
                    isRequired
                    isInvalid={!!error}
                    errorMessage={error?.message}
                  />
                </Skeleton>
              )}
            />
            <Controller
              name="address.neighborhood"
              control={control}
              defaultValue=""
              rules={{ required: 'Campo obrigatório' }}
              render={({ field, fieldState: { error } }) => (
                <Skeleton
                  className="rounded-md"
                  isLoaded={!(loadingCEP || loading)}
                >
                  <Input
                    label="Bairro"
                    id={field.name}
                    type="text"
                    onChange={field.onChange}
                    name={field.name}
                    value={field.value}
                    variant="bordered"
                    color="primary"
                    isRequired
                    isInvalid={!!error}
                    errorMessage={error?.message}
                  />
                </Skeleton>
              )}
            />
          </Row>
          <Row className="md:grid-cols-3">
            <Controller
              name={'address.publicArea'}
              control={control}
              defaultValue=""
              rules={{ required: 'Campo obrigatório' }}
              render={({ field, fieldState: { error } }) => (
                <Skeleton
                  className="col-span-2 rounded-md"
                  isLoaded={!(loadingCEP || loading)}
                >
                  <Input
                    label="Rua"
                    id={field.name}
                    type="text"
                    onChange={field.onChange}
                    name={field.name}
                    value={field.value}
                    variant="bordered"
                    color="primary"
                    isRequired
                    isInvalid={!!error}
                    errorMessage={error?.message}
                  />
                </Skeleton>
              )}
            />
            <Controller
              name="address.number"
              control={control}
              defaultValue=""
              rules={{ required: 'Campo obrigatório' }}
              render={({ field, fieldState: { error } }) => (
                <Skeleton
                  className="rounded-md"
                  isLoaded={!(loadingCEP || loading)}
                >
                  <Input
                    label="Número"
                    id={field.name}
                    type="text"
                    onChange={field.onChange}
                    name={field.name}
                    value={field.value}
                    variant="bordered"
                    color="primary"
                    isRequired
                    isInvalid={!!error}
                    errorMessage={error?.message}
                  />
                </Skeleton>
              )}
            />
          </Row>
          <div className="flex justify-between">
            <Button
              type="submit"
              variant="flat"
              color="primary"
              className="w-fit"
              isDisabled={loading}
            >
              Salvar
            </Button>

            <Button
              type="button"
              variant="bordered"
              color="primary"
              className="w-fit"
              isDisabled={loading}
              onClick={() => {
                router.push('/tinturaria')
              }}
            >
              Voltar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClientEdit
