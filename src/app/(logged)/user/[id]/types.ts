import { UserProps } from '@/types/user'

export type UserForm = Omit<UserProps, 'sectorIds'> & {
  password: string
  oldPassword?: string
  confirmPassword?: string
  // sectorIds: string[]
}
