import { DefaultProps } from '@/types/index'
import { RolProps } from '@/types/rol'
import { UserProps } from '@/types/user'

export interface LogsProps extends DefaultProps {
  type: 'pull' | 'delete'
  tableName: string
  dataAfterUpdate: RolProps
  dataBeforeUpdate: RolProps
  updatedFields: Record<keyof RolProps, RolProps[keyof RolProps]>
  user?: UserProps
  userId: number
}
