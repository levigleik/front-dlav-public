import { DefaultProps } from '@/types/index'

export interface OriginContactProps<Client> extends DefaultProps {
  name: string
  client?: Client
}
