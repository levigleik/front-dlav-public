'use client'

import { Button, NextUIProvider, cn } from '@nextui-org/react'
import { QueryClient, useQueryErrorResetBoundary } from '@tanstack/react-query'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'
import { ToastContainer, Zoom, toast } from 'react-toastify'

import { queryClientConfig } from '@/utils/constants'
import { delay, urlBase64ToUint8Array } from '@/utils/functions'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { useEffect, useState } from 'react'

let persister: any

export function Providers({ children }: { children: React.ReactNode }) {
  const navigate = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [queryClient, setQueryClient] = useState<QueryClient>()
  const { reset } = useQueryErrorResetBoundary()

  useEffect(() => {
    setIsClient(typeof window !== 'undefined')
  }, [])

  useEffect(() => {
    // Check if service workers are supported
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // Register the service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then(async (registration) => {
          registration.onupdatefound = () => {
            toast.promise(
              async () => {
                await delay(3000)
                return registration.update()
              },
              {
                pending: 'Atualizando...',
                success: 'Atualizado',
                error: 'Erro ao atualizar',
              },
              {
                position: 'bottom-center',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                transition: Zoom,
                rtl: false,
                draggable: true,
                theme: 'dark',
                className: cn(
                  'min-h-10 cursor-pointer justify-between',
                  'overflow-hidden rounded-[25px] bg-gray-900 p-3 text-white',
                  'md:mb-2 mb-8 md:m-0 m-4',
                ),
              },
            )
          }

          // Request permission for push notifications
          Notification.requestPermission().then(async (permission) => {
            if (permission === 'granted') {
              console.log('Notification permission granted.')
              // Subscribe user to push notifications
              console.log('PUBLIC KEY', process.env.NEXT_VAPID_PUBLIC_KEY)

              registration.pushManager
                .subscribe({
                  userVisibleOnly: true,
                  applicationServerKey:
                    'BFroLIshqSX1K9m2qcdOfig4cFdCnh53NF41utClsbPaBIO3uaoeiv2IruqYfhWG4-Mw1I1TjHislqfK9OjvJ-I',
                })
                .then(function (subscription) {
                  console.log('User is subscribed:', subscription)
                })
                .catch(function (error) {
                  console.error('Failed to subscribe the user: ', error)
                })
            } else {
              console.error('Unable to get permission to notify.')
            }
          })
        })
        .catch((error) => {
          console.log('Service worker registration failed:', error)
        })
    } else {
      console.log('Service workers are not supported.')
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      persister = createSyncStoragePersister({
        storage: window.localStorage,
      })
      setQueryClient(new QueryClient(queryClientConfig))
      console.log(process.env.NEXT_VERSION)
    }
  }, [isClient])

  if (!isClient) {
    return null
  }
  if (!queryClient) {
    return null
  }

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }: any) => (
        // <Layout>
        <div className="flex h-screen flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Ocorreu um erro</h1>
          <Button
            className="mt-4"
            onClick={() => {
              resetErrorBoundary()
            }}
          >
            Tentar novamente
          </Button>
        </div>
        // </Layout>
      )}
    >
      <NextUIProvider navigate={navigate.push}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
          onSuccess={() => {
            // resume mutations after initial restore from localStorage was successful
            queryClient.resumePausedMutations().then(() => {
              queryClient.invalidateQueries()
            })
          }}
        >
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <ToastContainer
              pauseOnHover={false}
              pauseOnFocusLoss={false}
              position="top-center"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              transition={Zoom}
              rtl={false}
              draggable
              theme="dark"
              toastClassName={cn(
                'min-h-10 cursor-pointer justify-between',
                'overflow-hidden rounded-[25px] bg-gray-900 p-3 text-white',
                'md:mb-2 mb-8 md:m-0 m-4',
              )}
            />
            {children}
          </NextThemesProvider>
        </PersistQueryClientProvider>
      </NextUIProvider>
    </ErrorBoundary>
  )
}
