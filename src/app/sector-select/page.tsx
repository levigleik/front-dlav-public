'use client'
import { useAuthState } from '@/hook/auth'
import { SectorProps } from '@/types/sector'
import { getData } from '@/utils/functions.api'
import { Button, Select, SelectItem } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import Cookie from 'js-cookie'
import { Controller, useForm } from 'react-hook-form'
import { SectorSelectFormProps } from './types'

export default function SectorSelect() {
  const { control, handleSubmit } = useForm<SectorSelectFormProps>()

  const auth = useAuthState()

  const { data, isLoading } = useQuery({
    queryKey: ['sector-get'],
    queryFn: ({ signal }) =>
      getData<SectorProps<any>[]>({
        url: '/sector',
        signal,
      }),
  })

  const onSubmit = (form: SectorSelectFormProps) => {
    auth.sectorSelect(form.sector)
    Cookie.set('sector', form.sector, {
      expires: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
    })
    window.location.reload()
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <form
        className="flex w-full flex-col items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="my-8 text-center text-xl font-bold">Selecionar setor</h1>
        <Controller
          name="sector"
          control={control}
          rules={{ required: 'Campo obrigatório' }}
          render={({ field, fieldState: { error } }) => (
            <Select
              label="Setor"
              id={field.name}
              onChange={field.onChange}
              name={field.name}
              selectedKeys={field.value ? [field.value] : new Set([])}
              variant="bordered"
              color="primary"
              isRequired
              isInvalid={!!error}
              errorMessage={error?.message}
              className="w-full"
              classNames={{
                value: 'text-foreground',
              }}
              isLoading={isLoading}
              items={data ?? []}
              selectionMode="single"
            >
              {(item) => (
                <SelectItem key={item.id} className="capitalize">
                  {item.name}
                </SelectItem>
              )}
            </Select>
          )}
        />
        <Button
          variant="bordered"
          type="submit"
          color="primary"
          className="mt-8 w-fit"
          disabled={isLoading}
        >
          Enviar
        </Button>
      </form>
    </div>
  )
}
