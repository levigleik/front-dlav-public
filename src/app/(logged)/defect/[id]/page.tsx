'use client'
import { PostData, PutData } from '@/types'
import { DefectProps } from '@/types/defect'
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
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const DefectEdit = () => {
  const { id } = useParams<{ id: string | 'new' }>()

  const { data: dataGetdDefect, isLoading: loadingGet } = useQuery({
    queryFn: ({ signal }) =>
      getData<DefectProps<any>>({
        url: 'defect',
        id: parseInt(id, 10),
        signal,
      }),
    queryKey: ['defect-get', id],
    enabled: id !== 'new',
  })

  const { mutateAsync: mutatePost, isPending: loadingPost } = useMutation({
    mutationFn: async (val: PostData<DefectProps<any>>) =>
      postData<DefectProps<any>, DefectProps<any>>(val),
    mutationKey: ['defect-post'],
  })

  const { mutateAsync: mutatePut, isPending: loadingPut } = useMutation({
    mutationFn: (val: PutData<DefectProps<any>>) =>
      putData<DefectProps<any>, DefectProps<any>>(val),
    mutationKey: ['defect-put'],
  })
  const { handleSubmit, setValue, control, reset, getValues } = useForm<
    DefectProps<any>,
    'defects'
  >()

  const onSubmit = (data: DefectProps<any>) => {
    if (id === 'new')
      mutatePost({
        url: '/defect',
        data: {
          ...data,
          description: '',
        },
      })
        .then(() => {
          toast.success('Defeito cadastrado com sucesso')
          reset()
        })
        .catch((error: any) => {
          toastErrorsApi(error)
        })
    else
      mutatePut({
        url: '/defect',
        data: {
          ...data,
          description: '',
        },
        id: parseInt(id, 10),
      })
        .then(() => {
          toast.success('Defeito atualizado com sucesso')
        })
        .catch((err) => {
          toastErrorsApi(err)
        })
  }

  const loading = loadingGet || loadingPost || loadingPut

  useEffect(() => {
    if (dataGetdDefect && id !== 'new') {
      setValue('name', dataGetdDefect.name)
    }
  }, [dataGetdDefect, id, setValue])

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

export default DefectEdit
