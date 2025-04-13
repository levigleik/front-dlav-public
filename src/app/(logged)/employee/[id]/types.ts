import { EmployeeProps } from '@/types/employee'

export type EmployeeFormProps = Omit<EmployeeProps<any>, 'clientId'> & {
  clientId: string
}
