'use client'

import Table from '@/components/table'
import { DeleteData } from '@/types'
import { GroupProps } from '@/types/group'
import { ProductProps } from '@/types/product'
import { UserProps } from '@/types/user'
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
import { useState } from 'react'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { columnsProducts } from './constants'
import { ColumnProps } from 'components/table/types'

export default function Product() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['product-get'],
    queryFn: ({ signal }) =>
      getData<ProductProps<GroupProps<any, any>>[]>({
        url: '/product',
        signal,
        query: 'include.group.include.priceList.include.client=true',
      }),
  })

  const { mutateAsync: mutateDelete, isPending: loadingDelete } = useMutation({
    mutationFn: async (val: DeleteData) => deleteData<UserProps>(val),
    mutationKey: ['product-delete'],
  })

  const router = useRouter()

  const [itemDelete, setItemDelete] = useState<number>()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const deleteItem = (id: number) => {
    mutateDelete({
      url: `/product`,
      id: id,
    })
      .then(() => {
        toast.success('Produto deletado com sucesso')
        void refetch()
      })
      .catch((err) => {
        toastErrorsApi(err)
      })
  }

  const finalColumns: ColumnProps<ProductProps<any>>[] = [
    ...columnsProducts,
    {
      uid: 'actions',
      label: 'Ações',
      renderCell: (item) => (
        <div className="relative flex cursor-pointer items-center justify-end gap-5">
          <Tooltip
            content="Editar"
            placement="bottom-end"
            className="text-white"
            color="primary"
          >
            <Button
              isIconOnly
              color="primary"
              className="rounded-full text-white"
              onClick={() => router.push(`product/${item.id}`)}
            >
              <FaPencilAlt size={20} className="text-white" />
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

  const loading = isLoading || loadingDelete

  return (
    <>
      <Table data={data} columns={finalColumns} loading={loading} />
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
                Tem certeza que deseja deletar o produto?
              </ModalHeader>
              <ModalBody>
                <div className={'flex flex-col gap-2 text-default-600'}>
                  Você está prestes a deletar o produto, deseja continuar?
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
