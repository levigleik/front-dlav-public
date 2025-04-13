import { SectorProps } from '@/types/sector'
import { DefaultProps } from '.'
export interface PasswordResetTokenProps {
  id: number
  value: string
  expires: string | null
  userId: number
  createdAt: string
  updateAt: string
}
export interface UserProps extends DefaultProps {
  id: number
  email: string
  userName: string
  active: boolean
  ownerId: number
  name: string
  role: 'admin' | 'manager' | 'worker'
  userId?: number
  passwordResetTokens: PasswordResetTokenProps | string
  sector?: SectorProps<any>
  sectorId: number
}
