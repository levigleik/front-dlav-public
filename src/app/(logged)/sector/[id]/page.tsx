'use client'
import { useAuthState } from '@/hook/auth'
import { PutData } from '@/types'
import { SectorProps } from '@/types/sector'
import { UserProps } from '@/types/user'
import { getData, putData, toastErrorsApi } from '@/utils/functions.api'
import {
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Skeleton,
} from '@nextui-org/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Row } from 'components/grid/row'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { SectorForm, SectorFormSend } from './types'

const SectorEdit = () => {
  const { id } = useParams<{ id: string | 'new' }>()

  const auth = useAuthState()

  const { data: dataGetUser, isLoading: loadingGet } = useQuery({
    queryFn: ({ signal }) =>
      getData<SectorProps<UserProps>>({
        url: 'sector',
        id: parseInt(id, 10),
        query: 'include.users=true',
        signal,
      }),
    queryKey: ['sector-get', id],
    enabled: id !== 'new',
  })

  const { data: dataUsers, isLoading: loadingUsers } = useQuery({
    queryFn: ({ signal }) =>
      getData<UserProps[]>({
        url: 'user',
        signal,
        query: 'where.role=worker&&orderBy.name=asc',
      }),
    queryKey: ['users-get'],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const { mutateAsync: mutatePut, isPending: loadingPut } = useMutation({
    mutationFn: (val: PutData<SectorFormSend>) =>
      putData<SectorProps<any>, SectorFormSend>(val),
    mutationKey: ['sector-put'],
  })

  const { handleSubmit, setValue, control } = useForm<SectorForm, 'sectors'>()

  const onSubmit = (data: SectorForm) => {
    const parseData = {
      ...data,
      userIds: data.userIds.map((a) => Number(a)),
    }
    mutatePut({
      url: '/sector',
      data: parseData,
      id: parseInt(id, 10),
    })
      .then(() => {
        toast.success(`Setor atualizado com sucesso.`)
      })
      .catch((err) => {
        toastErrorsApi(err)
      })
  }

  const loading = loadingGet || loadingPut

  useEffect(() => {
    if (dataGetUser && id !== 'new') {
      setValue('name', dataGetUser.name)
      setValue('userIds', dataGetUser.users?.map((a) => String(a.id)))
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
        <Controller
          name="userIds"
          control={control}
          defaultValue={dataUsers?.map((a) => a.id.toString())}
          render={({ field, fieldState: { error } }) => (
            <Skeleton className="rounded-md" isLoaded={!loading}>
              <Select
                label="Usuários"
                id={field.name}
                onSelectionChange={(value) => field.onChange(Array.from(value))}
                name={field.name}
                selectedKeys={
                  Array.isArray(field.value) ? new Set(field.value) : new Set()
                }
                variant="bordered"
                color="primary"
                isInvalid={!!error}
                errorMessage={error?.message}
                classNames={{
                  value: 'text-foreground',
                  label: 'overflow-visible',
                }}
                isLoading={loadingUsers}
                items={dataUsers ?? []}
                selectionMode="multiple"
                isMultiline={field.value?.length > 0}
                renderValue={(items) => {
                  return (
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <div key={item.key}>
                          <Chip
                            isCloseable
                            onClose={() => {
                              setValue(
                                field.name,
                                field.value.filter(
                                  (a) => a !== item.key?.toString(),
                                ),
                              )
                            }}
                          >
                            {item.data?.name}
                          </Chip>
                        </div>
                      ))}
                    </div>
                  )
                }}
              >
                {(item) => (
                  <SelectItem key={item.id} className="capitalize">
                    {item.name}
                  </SelectItem>
                )}
              </Select>
            </Skeleton>
          )}
        />
      </Row>
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

export default SectorEdit
