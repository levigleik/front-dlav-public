import { AuthStoreProps } from '@/types/auth'
import Cookie from 'js-cookie'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const useAuthState = create<AuthStoreProps>()(
  devtools(
    persist(
      (set, get) => ({
        setProfile: (profile) => {
          set(() => ({ profile }))
        },
        setProfileCleaner: (profileCleaner) => {
          set(() => ({ profileCleaner }))
        },
        setSigned: (signed) => {
          set(() => ({ signed }))
        },
        sectorSelect: (sector) => {
          set(() => ({ sector }))
        },
        resetSector: () => {
          set(() => ({ sector: undefined }))
          Cookie.remove('sector')
          window.location.reload()
        },
        logout: async () => {
          set(() => ({
            profile: undefined,
            company: undefined,
            signed: false,
            sector: undefined,
            cart: undefined,
          }))
          Cookie.remove('idToken')
          Cookie.remove('refreshToken')
          Cookie.remove('role')
          Cookie.remove('sector')
          Cookie.remove('signed')
          Cookie.remove('expiresIn')
          window.location.reload()
        },
        logoutCleaner: async () => {
          set(() => ({
            profileCleaner: undefined,
            signed: false,
          }))
          Cookie.remove('cleanerSigned')
          window.location.reload()
        },
      }),
      {
        name: 'auth-state',
      },
    ),
  ),
)
