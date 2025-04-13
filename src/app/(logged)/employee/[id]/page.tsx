'use client'
import { PostData, PutData } from '@/types'
import { ClientProps } from '@/types/client'
import {
  getData,
  postData,
  putData,
  toastErrorsApi,
} from '@/utils/functions.api'
import { Button, Input, Skeleton } from '@nextui-org/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Row } from 'components/grid/row'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { EmployeeProps } from '@/types/employee'
import { EmployeeFormProps } from '@/app/(logged)/employee/[id]/types'

import { firstDeployClients } from '@/app/(logged)/client/constants'
import { Combobox } from '@/components/ui/combobox'

const EmployeeEdit = () => {
  const { id } = useParams<{ id: string | 'new' }>()

  const { data: dataGetEmployee, isLoading: loadingGet } = useQuery({
    queryFn: ({ signal }) =>
      getData<EmployeeProps<ClientProps>>({
        url: 'employee',
        id: parseInt(id, 10),
        signal,
        query: 'include.client=true',
      }),
    queryKey: ['employee-get', id],
    enabled: id !== 'new',
  })

  const { mutateAsync: mutatePost, isPending: loadingPost } = useMutation({
    mutationFn: async (val: PostData<EmployeeProps<any>>) =>
      postData<EmployeeProps<any>, EmployeeProps<any>>(val),
    mutationKey: ['employee-post'],
  })

  const { mutateAsync: mutatePut, isPending: loadingPut } = useMutation({
    mutationFn: (val: PutData<EmployeeProps<any>>) =>
      putData<EmployeeProps<any>, EmployeeProps<any>>(val),
    mutationKey: ['employee-put'],
  })

  const { handleSubmit, setValue, control, reset, getValues } = useForm<
    EmployeeFormProps,
    'employees'
  >()

  const { data: dataGetClient, isLoading: loadingGetClient } = useQuery({
    queryKey: ['client-get'],
    queryFn: ({ signal }) =>
      getData<ClientProps[]>({
        url: '/client',
        query: 'include.address=true',
        signal,
      }),
    select: (data) => {
      const newData = data?.filter((item) =>
        firstDeployClients.some((item2) =>
          item.fantasyName.toLowerCase().includes(item2.toLowerCase()),
        ),
      )
      console.log(newData)
      return newData
    },
  })

  const onSubmit = (data: EmployeeFormProps) => {
    const parseData = {
      ...data,
      clientId: Number(data.clientId),
    }
    if (id === 'new')
      mutatePost({
        url: '/employee',
        data: parseData,
      })
        .then(() => {
          toast.success('Empregado cadastrado com sucesso')

          reset()
        })
        .catch((error: any) => {
          toastErrorsApi(error)
        })
    else
      mutatePut({
        url: '/employee',
        data: parseData,
        id: parseInt(id, 10),
      })
        .then(() => {
          toast.success('Empregado atualizado com sucesso')
        })
        .catch((err) => {
          toastErrorsApi(err)
        })
  }

  const loading = loadingGet || loadingPost || loadingPut

  // const [clientSearchTerm, setClientSearchTerm] = useState('')

  useEffect(() => {
    if (dataGetEmployee && id !== 'new') {
      setValue('name', dataGetEmployee.name)
      setValue('matriculation', dataGetEmployee.matriculation)
      setValue('armario', dataGetEmployee.armario)
      setValue('gaveta', dataGetEmployee.gaveta)
      setValue('clientId', String(dataGetEmployee.clientId))
    }
  }, [dataGetEmployee, id, setValue])

  // const filteredData = useMemo(() => {
  //   if (clientSearchTerm === '') {
  //     return dataGetClient
  //   } else {
  //     return dataGetClient?.filter((item) =>
  //       item.fantasyName.toLowerCase().includes('lav'.toLowerCase()),
  //     )
  //   }
  // }, [dataGetClient, clientSearchTerm])

  // useEffect(() => {
  //   console.log(filteredData)
  //   console.log(clientSearchTerm)
  // }, [clientSearchTerm, filteredData])

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
          name="matriculation"
          control={control}
          defaultValue=""
          rules={{ required: 'Campo obrigatório' }}
          render={({ field, fieldState: { error } }) => (
            <Skeleton className="rounded-md" isLoaded={!loading}>
              <Input
                label="Matrícula"
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
          name="armario"
          control={control}
          defaultValue=""
          rules={{ required: 'Campo obrigatório' }}
          render={({ field, fieldState: { error } }) => (
            <Skeleton className="rounded-md" isLoaded={!loading}>
              <Input
                label="Armario"
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
          name="gaveta"
          control={control}
          defaultValue=""
          rules={{ required: 'Campo obrigatório' }}
          render={({ field, fieldState: { error } }) => (
            <Skeleton className="rounded-md" isLoaded={!loading}>
              <Input
                label="Gaveta"
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
          name="clientId"
          control={control}
          rules={{ required: 'Campo obrigatório' }}
          render={({ field, fieldState: { error } }) => (
            <Skeleton
              className="h-14 rounded-md [&>div]:h-14"
              isLoaded={!loadingGetClient}
            >
              <Combobox
                id={field.name}
                data={dataGetClient ?? []}
                value={field.value}
                onChange={field.onChange}
                label="Cliente"
                filterKey={['fantasyName', 'corporateName']}
                textValueKey="fantasyName"
                isRequired
                itemRenderer={(item) => (
                  <div className="flex flex-col gap-2">
                    <span className="font-bold">{item.fantasyName}</span>
                    <small className="text-tiny text-default-400">
                      {item.address?.publicArea}, {item.address?.number}
                    </small>
                  </div>
                )}
              />
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

export default EmployeeEdit
