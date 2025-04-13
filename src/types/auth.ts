import { UserProps } from '@/types/user'
import { ClientTinturariaProps } from '@/types/clientTinturaria'

export interface AxiosApiError<T> {
  error: keyof T
  message: string | string[]
  statusCode: number
}

export interface AuthStoreProps {
  profile?: Omit<UserProps, 'id'>
  setProfile: (profile: UserProps) => void
  profileCleaner?: ClientTinturariaProps
  setProfileCleaner: (profile: ClientTinturariaProps) => void
  signed?: boolean
  setSigned: (signed: boolean) => void
  sector?: string
  sectorSelect: (id: string) => void
  resetSector: () => void
  logout: () => Promise<void>
  logoutCleaner: () => Promise<void>
}
export interface TokenProps {
  exp: number
  iat: number
  sessionId: number
}

export interface LoginReturnProps {
  idToken: string
  refreshToken: string
  user: UserProps
}
