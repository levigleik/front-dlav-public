import { DefaultProps } from '@/types/index'
import { WashControlEmployeeProps } from '@/types/washControlEmployee'

export interface EmployeeProps<Client> extends DefaultProps {
  name: string
  matriculation: string
  clientId: number
  client?: Client
  armario: string
  gaveta: string
  washControlEmployees?: WashControlEmployeeProps<Client, any>[]
}
