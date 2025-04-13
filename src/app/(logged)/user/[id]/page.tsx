'use client'

import { UserForm } from '@/app/(logged)/user/[id]/types'
import { useAuthState } from '@/hook/auth'
import api from '@/services/api'
import { PostData, PutData } from '@/types'
import { AxiosApiError } from '@/types/auth'
import { UserProps } from '@/types/user'
import { roleOptions, userErrors } from '@/utils/constants'
import {
  getData,
  postData,
  putData,
  toastErrorsApi,
} from '@/utils/functions.api'
import {
  Button,
  Input,
  Select,
  SelectItem,
  Skeleton,
  Switch,
} from '@nextui-org/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios/index'
import { Row } from 'components/grid/row'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const UserEdit = () => {
  const { id } = useParams<{ id: string | 'new' }>()

  const auth = useAuthState()

  const isMe = auth.profile?.userId === parseInt(id, 10)

  const { data: dataGetUser, isLoading: loadingGet } = useQuery({
    queryFn: ({ signal }) =>
      getData<UserProps>({
        url: 'user',
        id: parseInt(id, 10),
        signal,
      }),
    queryKey: ['user-get', id],
    enabled: id !== 'new',
  })

  const { mutateAsync: mutatePost, isPending: loadingPost } = useMutation({
    mutationFn: async (val: PostData<UserProps>) =>
      postData<UserProps, UserProps>(val),
    mutationKey: ['user-post'],
  })

  const { mutateAsync: mutatePut, isPending: loadingPut } = useMutation({
    mutationFn: (val: PutData<UserProps>) => putData<UserProps, UserProps>(val),
    mutationKey: ['user-put'],
  })

  const { handleSubmit, setValue, control, getValues, reset } = useForm<
    UserForm,
    'users'
  >()

  const [changePassword, setChangePassword] = useState(false)

  const onSubmit = (data: UserForm) => {
    const parseData: UserProps = {
      ...data,
      sectorId: 1,
    }
    if (id === 'new')
      mutatePost({
        url: '/user/' + data.role,
        data: parseData,
      })
        .then(() => {
          toast.success('Usuário cadastrado com sucesso')
          reset()
        })
        .catch((error: AxiosError<AxiosApiError<typeof userErrors>>) => {
          toastErrorsApi(error)
        })
    else
      mutatePut({
        url: '/user',
        data: parseData,
        id: parseInt(id, 10),
      })
        .then(() => {
          if (changePassword && isMe) {
            api
              .post('auth/change-password', {
                newPassword: data.password,
                oldPassword: data.oldPassword,
              })
              .then(() => {
                toast.success(`Usuário atualizado com sucesso.`)
              })
              .catch((err: AxiosError<AxiosApiError<any>>) => {
                if (err.response?.data.error === 'invalid-oldPassword')
                  toast.error(`Senha atual inválida, tente novamente.`)
                else toast.error(`Erro ao alterar senha.`)
              })
          } else {
            toast.success(`Usuário atualizado com sucesso.`)
          }
        })
        .catch((err) => {
          toastErrorsApi(err)
        })
  }

  const loading = loadingGet || loadingPost || loadingPut

  useEffect(() => {
    if (dataGetUser && id !== 'new') {
      setValue('name', dataGetUser.name)
      setValue('email', dataGetUser.email)
      setValue('role', dataGetUser.role)
      setValue('userName', dataGetUser.userName)
    }
  }, [dataGetUser, id, setValue])

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <Row>
        <Controller
          name="name"
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
        {id === 'new' && (
          <Controller
            name="role"
            control={control}
            rules={{ required: 'Campo obrigatório' }}
            render={({ field, fieldState: { error } }) => (
              <Skeleton className="rounded-md" isLoaded={!loading}>
                <Select
                  label="Tipo de usuário"
                  id={field.name}
                  onChange={field.onChange}
                  name={field.name}
                  selectedKeys={field.value ? [field.value] : new Set([])}
                  variant="bordered"
                  color="primary"
                  isRequired
                  isInvalid={!!error}
                  errorMessage={error?.message}
                  classNames={{
                    value: 'text-foreground',
                  }}
                >
                  {roleOptions.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label}
                    </SelectItem>
                  ))}
                </Select>
              </Skeleton>
            )}
          />
        )}
      </Row>
      {id === 'new' && (
        <Row>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{ required: 'Campo obrigatório' }}
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
                  isRequired
                  isInvalid={!!error}
                  errorMessage={error?.message}
                />
              </Skeleton>
            )}
          />
          <Controller
            name="userName"
            control={control}
            defaultValue=""
            rules={{ required: 'Campo obrigatório' }}
            render={({ field, fieldState: { error } }) => (
              <Skeleton className="rounded-md" isLoaded={!loading}>
                <Input
                  label="Usuário"
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
      )}
      {id !== 'new' && isMe && (
        <Row>
          <Switch
            id="changePassword"
            checked={changePassword}
            onChange={() => setChangePassword(!changePassword)}
          >
            <div className="flex">
              <p className="text-medium">Alterar senha</p>
            </div>
          </Switch>
          {changePassword && (
            <Controller
              name="oldPassword"
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
                <Skeleton className="rounded-md" isLoaded={!loading}>
                  <Input
                    label="Senha atual"
                    id={field.name}
                    type="password"
                    onChange={field.onChange}
                    name={field.name}
                    value={field.value}
                    variant="bordered"
                    color="primary"
                    isRequired={changePassword}
                    isInvalid={!!error}
                    errorMessage={error?.message}
                  />
                </Skeleton>
              )}
            />
          )}
        </Row>
      )}
      {(id === 'new' || (changePassword && isMe)) && (
        <Row>
          <Controller
            name="password"
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
              <Skeleton className="rounded-md" isLoaded={!loading}>
                <Input
                  label={id === 'new' ? 'Senha' : 'Nova senha'}
                  id={field.name}
                  type="password"
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
            name="confirmPassword"
            control={control}
            defaultValue=""
            rules={{
              validate: (value) => {
                if (!value) return 'Campo obrigatório'
                if (value !== getValues('password'))
                  return 'As senhas não coincidem'
                return true
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <Skeleton className="rounded-md" isLoaded={!loading}>
                <Input
                  label="Confirmar senha"
                  id={field.name}
                  type="password"
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
      )}

      <Button
        type="submit"
        variant="flat"
        color="primary"
        className="w-fit"
        isDisabled={loading}
      >
        Salvar
      </Button>
    </form>
  )
}

export default UserEdit
