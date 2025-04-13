'use client'

import Table from '@/components/table'
import { PostData } from '@/types'
import { UserProps } from '@/types/user'
import { getData, postData, toastErrorsApi } from '@/utils/functions.api'
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
import { FaPencilAlt, FaUser, FaUserAltSlash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { columnsUsers } from './contants'
import { ColumnProps } from 'components/table/types'

export default function User() {
  const { data, isLoading } = useQuery({
    queryKey: ['user-get'],
    queryFn: ({ signal }) => getData<UserProps[]>({ url: '/user', signal }),
  })

  const { mutateAsync: mutatePost, isPending: loadingPost } = useMutation({
    mutationFn: async (val: PostData<{ userId: number }>) =>
      postData<UserProps, { userId: number }>(val),
    mutationKey: ['user-activate'],
  })

  const router = useRouter()

  const [userToChange, setUserToChange] = useState<UserProps>()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const changeUserStatus = (item: UserProps) => {
    mutatePost({
      url: `/auth/${item.active ? 'disable' : 'activate'}`,
      data: {
        userId: item.id,
      },
    })
      .then(() => {
        toast.success(
          `Usuário ${item.active ? 'desativado' : 'ativado'} com sucesso.`,
        )
      })
      .catch((err) => {
        toastErrorsApi(err)
      })
  }

  const finalColumns: ColumnProps<UserProps>[] = [
    ...columnsUsers,
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
              onClick={() => router.push(`user/${item.id}`)}
            >
              <FaPencilAlt size={20} className="text-white" />
            </Button>
          </Tooltip>
          <Tooltip
            content={`${item.active ? 'Desativar' : 'Ativar'} usuário`}
            placement="bottom-end"
            className="text-white"
            color="primary"
          >
            <Button
              isIconOnly
              color={item.active ? 'danger' : 'success'}
              onClick={() => {
                setUserToChange(item)
                onOpen()
              }}
              className="rounded-full"
            >
              {item.active ? (
                <FaUserAltSlash size={20} className="text-white" />
              ) : (
                <FaUser size={20} className="text-white" />
              )}
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ]

  const loading = loadingPost || isLoading

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
                Tem certeza que deseja{' '}
                {userToChange?.active ? 'desativar' : 'ativar'} o usuário?
              </ModalHeader>
              <ModalBody>
                <div className={'flex flex-col gap-2 text-default-600'}>
                  Você está prestes a{' '}
                  {userToChange?.active ? 'desativar' : 'ativar'} o usuário,
                  deseja continuar?
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Não
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    if (!userToChange) return
                    changeUserStatus(userToChange)
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
