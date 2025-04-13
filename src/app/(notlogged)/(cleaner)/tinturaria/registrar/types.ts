import { ClientProps } from '@/types/client'

export type ClientFormProps = Omit<
  ClientProps,
  'originContactId' | 'branchId'
> & {
  originContactId: string
  branchId: string
}
