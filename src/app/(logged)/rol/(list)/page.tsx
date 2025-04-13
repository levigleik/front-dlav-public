'use client'

import Table from '@/components/table'
import { deleteData, getData, toastErrorsApi } from '@/utils/functions.api'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FaEye, FaPencilAlt, FaTimes, FaTrash } from 'react-icons/fa'
import { columnsRols } from './contants'
import { RolProps } from '@/types/rol'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { DeleteData } from '@/types'
import { nanoid } from 'nanoid'
import { useCart } from '@/app/(logged)/rol/cart/hook'
import { OutputFormat, setDefaults } from 'react-geocode'
import { ColumnProps } from 'components/table/types'

setDefaults({
  key: process.env.NEXT_GOOGLE_API_KEY,
  language: 'pt-br',
  region: 'br',
  outputFormat: OutputFormat.JSON,
})

export default function Rol() {
  const router = useRouter()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['rol-get'],
    queryFn: ({ signal }) =>
      getData<RolProps[]>({
        url: 'rol',
        signal,
        query:
          'include.rolSigningUser.include.user=true' +
          '&&include.products=true&&include.client.include.address=true',
      }),
  })
  const { mutateAsync: mutateDelete, isPending: loadingDelete } = useMutation({
    mutationFn: async (val: DeleteData) => deleteData<RolProps>(val),
    mutationKey: ['rol-delete'],
  })

  const [itemDelete, setItemDelete] = useState<number>()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  // const { expandedColumns, setExpandedColumns } = useTableHook()

  const { setCart, setTempCart, setIsViewOnly } = useCart()

  const deleteItem = (id: number) => {
    mutateDelete({
      url: `rol`,
      id: id,
    })
      .then(() => {
        toast.success('Rol deletado com sucesso')
        void refetch()
      })
      .catch((err) => {
        toastErrorsApi(err)
      })
  }
  //
  // useEffect(() => {
  //   console.log(expandedColumns)
  // }, [expandedColumns])

  const finalColumns: ColumnProps<RolProps>[] = [
    // {
    //   uid: 'expand',
    //   label: 'expand',
    //   renderCell: (item: RolProps) => (
    //     <Button
    //       isIconOnly={true}
    //       color="default"
    //       radius="full"
    //       onClick={() => {
    //         // if (expandedColumns.includes(item.id)) {
    //         //   setExpandedColumns(
    //         //     expandedColumns.filter(
    //         //       (id) => id !== item.id,
    //         //     ),
    //         //   )
    //         // } else {
    //         setExpandedColumns([...expandedColumns, item.id])
    //
    //         // console.log([...expandedColumns, item.id])
    //         // }
    //         // console.log(expandedColumns)
    //       }}
    //     >
    //       {expandedColumns.includes(item.id) ? <FaArrowUp /> : <FaArrowDown />}
    //     </Button>
    //   ),
    // },
    ...columnsRols,
    // {
    //   uid: 'startLocation',
    //   label: 'Local de início',
    //   renderCell: (row: RolProps) =>
    //     row.rolSigningUser?.user?.name ?? 'Sem usuário',
    // },
    {
      uid: 'actions',
      label: 'Ações',
      renderCell: (item) => (
        <div className="relative flex cursor-pointer items-center justify-end gap-5">
          {item.status === 'inProgress' && (
            <Tooltip
              content="Cancelar"
              placement="bottom-end"
              className="text-white"
              color="warning"
            >
              <Button
                isIconOnly
                color="warning"
                className="rounded-full text-white"
                onClick={() => {
                  // setIsViewOnly(true)
                  // const tempCart = {
                  //   ...item,
                  //   products: item.products.map((product) => ({
                  //     ...product,
                  //     nanoid: nanoid(),
                  //   })),
                  //   total: Number(item.total) ?? 0,
                  // }
                  // setCart(tempCart)
                  // setTempCart(tempCart)
                  // router.push(`rol/cart`)
                }}
              >
                <FaTimes size={20} className="text-white" />
              </Button>
            </Tooltip>
          )}
          {item.status !== 'finished' && item.status !== 'canceled' && (
            <Tooltip
              content="Visualizar"
              placement="bottom-end"
              className="text-white"
              color="primary"
            >
              <Button
                isIconOnly
                color="primary"
                className="rounded-full text-white"
                onClick={() => {
                  setIsViewOnly(true)
                  const tempCart = {
                    ...item,
                    products: item.products.map((product) => ({
                      ...product,
                      nanoid: nanoid(),
                    })),
                    total: Number(item.total) ?? 0,
                  }
                  setCart(tempCart)
                  setTempCart(tempCart)
                  router.push(`rol/cart`)
                }}
              >
                <FaEye size={20} className="text-white" />
              </Button>
            </Tooltip>
          )}
          <Tooltip
            content={
              item.status === 'finished' || item.status === 'canceled'
                ? 'Visualizar'
                : 'Editar'
            }
            placement="bottom-end"
            className="text-white"
            color="primary"
            // isDisabled={item.status === 'finished'}
          >
            <Button
              isIconOnly
              color="primary"
              className="rounded-full text-white"
              // isDisabled={item.status === 'finished'}
              onClick={() => {
                if (item.status === 'finished' || item.status === 'canceled')
                  setIsViewOnly(true)
                else setIsViewOnly(false)
                const tempCart = {
                  ...item,
                  products: item.products.map((product) => ({
                    ...product,
                    nanoid: nanoid(),
                  })),
                  total: Number(item.total) ?? 0,
                }
                setCart(tempCart)
                setTempCart(tempCart)
                router.push(`rol/cart`)
              }}
            >
              {item.status === 'finished' || item.status === 'canceled' ? (
                <FaEye size={20} className="text-white" />
              ) : (
                <FaPencilAlt size={20} className="text-white" />
              )}
            </Button>
          </Tooltip>
          <Tooltip
            content="Deletar"
            placement="bottom-end"
            className="text-white"
            color="danger"
          >
            <Button
              isIconOnly
              color="danger"
              className="rounded-full"
              onClick={() => {
                setItemDelete(item.id)
                onOpen()
              }}
            >
              <FaTrash size={20} className="text-white" />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ]

  return (
    <>
      <Table data={data} columns={finalColumns} loading={isLoading} />
      <Modal
        isOpen={isOpen}
        backdrop="opaque"
        classNames={{
          backdrop: 'blur-md',
        }}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="mt-4 flex flex-col gap-1">
                Tem certeza que deseja deletar o rol?
              </ModalHeader>
              <ModalBody>
                <div className={'flex flex-col gap-2 text-default-600'}>
                  Você está prestes a deletar o rol, deseja continuar?
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Não
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    if (!itemDelete) return
                    deleteItem(itemDelete)
                    onClose()
                  }}
                >
                  Sim
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
