'use client'

import React, { useEffect, useRef } from 'react'
import {
  Button,
  Chip,
  cn,
  Input,
  Select,
  SelectItem,
  Skeleton,
  Tooltip,
} from '@nextui-org/react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import Loading from 'components/loading'
import { Row } from 'components/grid/row'
import { useQuery } from '@tanstack/react-query'
import { getData } from '@/utils/functions.api'
import TabsFunc from '@/app/(logged)/rol/new/tabs'
import { ProductRolGroupFormProps } from '@/app/(logged)/rol/cart/(tabs)/types'
import { FaTrash } from 'react-icons/fa'
import { formatBRL } from '@/utils/functions'
import { ProductStatusProps } from '@/types/productStatus'
import { QRCodeSVG } from 'qrcode.react'
import { RolProps } from '@/types/rol'
import { nanoid } from 'nanoid'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCartTinturaria } from '@/app/(notlogged)/(cleaner)/tinturaria/(logged)/novo/carrinho/hook'

export default function SubdivisionTab() {
  const { cart, setCart } = useCartTinturaria()
  const componentRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { data: dataGetStatus, isLoading: loadingGetStatus } = useQuery({
    queryFn: ({ signal }) =>
      getData<ProductStatusProps<any>[]>({
        url: 'productStatus',
        signal,
      }),
    queryKey: ['product-status-get'],
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
  const hasId = useSearchParams().has('id')

  const id = cart?.id
  const { data, isLoading, isError } = useQuery({
    queryFn: ({ signal }) =>
      getData<RolProps>({
        url: 'rol/find-first',
        signal,
        query:
          'include.rolSigningUser.include.user=true' +
          '&&include.products=true&&include.client.include.address=true' +
          `${id ? `&&where.id=${id}` : ''}`,
      }),
    queryKey: ['rol-get', id],
    enabled: !hasId,
  })

  const { setValue, control, watch } = useForm<
    ProductRolGroupFormProps,
    'subdivision'
  >()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields',
  })

  const loading = false

  useEffect(() => {
    append({
      productRolIds: [],
      productStatusId: '1',
      name: '',
    })
  }, [append])

  useEffect(() => {
    if (data && !isError) {
      setCart({
        ...data,
        products: data.products.map((product) => ({
          ...product,
          nanoid: nanoid(),
        })),
      })
    }
  }, [data, isError, setCart])

  const getAvailableProducts = (currentIndex: number) => {
    // Get all selected products in previous lots
    const selectedProductsInPreviousLots = fields
      .slice(0, currentIndex)
      .flatMap((field) => field.id)

    // Filter out the selected products from the total products
    return cart?.products?.filter(
      (product) => !selectedProductsInPreviousLots.includes(String(product.id)),
    )
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <TabsFunc cart={true} isSearchable={false} />
      {loading && <Loading />}
      {fields?.map((item, index) => {
        // Obtenha o array de produtos do lote atual
        const productsArray = watch(`fields.${index}.productRolIds`)

        const nameSubdivision = watch(`fields.${index}.name`)
        const idSubdivision = watch(`fields.${index}.id`) ?? ''

        const editable = idSubdivision === ''

        console.log('idSubdivision', idSubdivision)
        console.log(editable)

        // Inclua a string codificada na URL
        const url = `${process.env.NEXT_FRONT_URL}/rol/subdivision?id=${idSubdivision}`
        console.log(url)
        return (
          <div
            key={item.id}
            className="flex flex-col gap-4 overflow-auto rounded-large bg-content1 p-4 shadow-small"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xl font-bold text-default-600">
                Lote {index + 1}
              </span>
              {!idSubdivision && (
                <Tooltip
                  content="Deletar lote"
                  placement="bottom-end"
                  className="text-white"
                  color="danger"
                >
                  <Button
                    type="button"
                    color="danger"
                    className="w-fit rounded-full text-main-white"
                    onClick={() => remove(index)}
                    isDisabled={loading}
                    isIconOnly
                  >
                    <FaTrash size={20} className="text-white" />
                  </Button>
                </Tooltip>
              )}
              {idSubdivision && (
                <Tooltip
                  content="Deletar lote"
                  placement="bottom-end"
                  className="text-white"
                  color="danger"
                >
                  <Button
                    type="button"
                    color="danger"
                    className="w-fit rounded-full text-main-white"
                    onClick={() => remove(index)}
                    isDisabled={loading}
                    isIconOnly
                  >
                    <FaTrash size={20} className="text-white" />
                  </Button>
                </Tooltip>
              )}
            </div>
            <Row>
              <Controller
                name={`fields.${index}.productRolIds`}
                control={control}
                rules={{ required: 'Campo obrigatório' }}
                render={({ field, fieldState: { error } }) => (
                  <Skeleton className="rounded-md" isLoaded={!loading}>
                    <Select
                      label="Produtos"
                      id={field.name}
                      onSelectionChange={(value) =>
                        field.onChange(Array.from(value))
                      }
                      name={field.name}
                      selectedKeys={
                        Array.isArray(field.value)
                          ? new Set(field.value)
                          : new Set()
                      }
                      variant="bordered"
                      color="primary"
                      isInvalid={!!error}
                      isRequired
                      isDisabled={!editable}
                      errorMessage={error?.message}
                      classNames={{
                        value: 'text-foreground',
                        label: 'overflow-visible',
                      }}
                      isLoading={loading}
                      items={getAvailableProducts(index)}
                      selectionMode="multiple"
                      isMultiline={(field.value?.length ?? 0) > 0}
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
                                      field.value?.filter(
                                        (a) => a !== item.key?.toString(),
                                      ),
                                    )
                                  }}
                                >
                                  {item.data?.quantity}x {item.data?.name} -{' '}
                                  {formatBRL.format(item.data?.price ?? 0)}
                                </Chip>
                              </div>
                            ))}
                          </div>
                        )
                      }}
                    >
                      {(item) => (
                        <SelectItem
                          key={String(item.id)}
                          className="capitalize"
                          textValue={String(item.id)}
                        >
                          <div className="flex flex-col gap-2">
                            <span className="font-bold">
                              {item?.quantity}x {item?.name} -{' '}
                              {formatBRL.format(item?.price ?? 0)}
                            </span>
                          </div>
                        </SelectItem>
                      )}
                    </Select>
                  </Skeleton>
                )}
              />
              <Controller
                name={`fields.${index}.productStatusId`}
                control={control}
                rules={{ required: 'Campo obrigatório' }}
                defaultValue="1"
                render={({ field, fieldState: { error } }) => (
                  <Skeleton className="rounded-md" isLoaded={!loading}>
                    <Select
                      label="Status"
                      id={field.name}
                      onChange={field.onChange}
                      name={field.name}
                      selectedKeys={field.value ? [field.value] : new Set([])}
                      variant="bordered"
                      color="primary"
                      isRequired
                      isDisabled={!editable}
                      isInvalid={!!error}
                      errorMessage={error?.message}
                      classNames={{
                        value: 'text-foreground',
                      }}
                      items={dataGetStatus ?? []}
                      isLoading={loadingGetStatus}
                    >
                      {(item) => (
                        <SelectItem
                          key={item.id}
                          value={item.id}
                          textValue={item.name}
                        >
                          <div className="flex flex-col gap-2">
                            <span className="font-bold">{item.name}</span>
                          </div>
                        </SelectItem>
                      )}
                    </Select>
                  </Skeleton>
                )}
              />
              <Controller
                name={`fields.${index}.name`}
                control={control}
                defaultValue=""
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
                      isInvalid={!!error}
                      isDisabled={!editable}
                      errorMessage={error?.message}
                    />
                  </Skeleton>
                )}
              />
            </Row>
            {productsArray?.length > 0 && idSubdivision !== '' && (
              <div>
                <div
                  ref={componentRef}
                  className={cn(
                    'mb-4 w-fit border-1 border-default-400 bg-white p-2 text-center text-sm text-default-300',
                  )}
                >
                  <QRCodeSVG
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/rol/subdivision?id=${idSubdivision}`)
                    }
                    id="qrcode"
                    bgColor="transparent"
                    value={url}
                  />
                  {/*<Link*/}
                  {/*  className="mt-2 text-blue-400 underline"*/}
                  {/*  href={`/rol/subdivision?products=${encodedProducts}`}*/}
                  {/*  rel="noopener noreferrer"*/}
                  {/*  target="_blank"*/}
                  {/*>*/}
                  {/*  Abrir QRCode*/}
                  {/*</Link>*/}
                </div>

                <Button
                  type="button"
                  variant="flat"
                  color="primary"
                  className="w-fit rounded-full data-[hover=true]:bg-main-200 data-[hover=true]:text-main-white "
                  isDisabled={loading}
                  onClick={() => {
                    if (!componentRef.current) return

                    // Create a new window
                    const printWindow = window.open('', '_blank')

                    // Check if the new window is created successfully
                    if (printWindow) {
                      // Convert the content of componentRef.current into a string
                      let content = componentRef.current.innerHTML

                      // Write the modified content into the new window
                      // printWindow.document.write(content)

                      const ElementToPrint = `
                        <div>
                          <br />
                          <span>
                            Cliente:
                            ${
                              cart?.client?.fantasyName ??
                              cart?.client?.corporateName
                            }
                          </span>
                          <br />
                          <span>
                            Lote: ${nameSubdivision}
                          </span>
                        </div>
                      `

                      // Include the content to be printed
                      printWindow.document.write(content + ElementToPrint)
                      // Include the CSS styles
                      printWindow.document.write(`
                        <style>
                          @media print {
                            body {
                              color: black;
                              background-color: white;
                              font-size: 12px;
                              margin: 0;
                              text-align: center;
                            }
                          }
                        </style>
                      `)
                      // Print the new window
                      printWindow.print()
                    }
                  }}
                >
                  Imprimir QRCODE
                </Button>
              </div>
            )}
          </div>
        )
      })}
      {getAvailableProducts(fields?.length ?? 0)?.length !== 0 && (
        <Button
          type="button"
          variant="bordered"
          color="primary"
          className="w-fit rounded-full data-[hover=true]:bg-main-200 data-[hover=true]:text-main-white "
          isDisabled={loading}
          onClick={() => {
            append({
              productRolIds: [],
              productStatusId: '1',
              name: '',
              id: '',
            })
          }}
        >
          Adicionar lote
        </Button>
      )}

      <Button
        type="submit"
        variant="flat"
        color="primary"
        className="w-fit"
        isDisabled={loading}
      >
        Salvar lotes
      </Button>
    </div>
  )
}
