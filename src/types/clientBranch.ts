import { DefaultProps } from '@/types/index'

export interface ClientBranchProps<Client> extends DefaultProps {
  name: string
  client?: Client
}
