'use client'
import Loading from '@/app/loading'
import Navbar from '@/components/navbar'
import { Skeleton } from '@nextui-org/react'
import { Suspense, useEffect, useState } from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import api from '@/services/api'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isOnline, setIsOnline] = useState(true)
  const [offlineRequests, setOfflineRequests] = useState<
    {
      id: number
      url: string
      method: string
      headers: Record<string, any>
      data: any
    }[]
  >([])

  const [loading, setLoading] = useState(false)

  const sendOfflineRequests = async () => {
    const offlineRequestsJson =
      JSON.parse(localStorage.getItem('offlineRequests') ?? '[]') ?? []
    if (offlineRequestsJson.length > 0) {
      setLoading(true)
      for (const request of offlineRequestsJson) {
        try {
          await api({
            url: request.url,
            method: request.method,
            headers: request.headers,
            data: request.data ? JSON.parse(request.data) : undefined,
          })
          const newOfflineRequests = offlineRequests.filter(
            (offlineRequest) => offlineRequest.id !== request.id,
          )
          setOfflineRequests(newOfflineRequests)
          localStorage.setItem(
            'offlineRequests',
            JSON.stringify(newOfflineRequests),
          )
        } catch (error) {
          console.log(error)
        }
      }
      setLoading(false)
    }
  }

  window.addEventListener('online', async () => {
    console.log('Online')
    setIsOnline(true)
    await sendOfflineRequests()
  })
  window.addEventListener('offline', () => {
    setIsOnline(false)
    console.log('Offline')
  })

  useEffect(() => {
    const offlineRequestsJson =
      JSON.parse(localStorage.getItem('offlineRequests') ?? '[]') ?? []
    setOfflineRequests(offlineRequestsJson)
  }, [])

  return (
    <div className="flex min-h-full flex-col">
      <Suspense
        fallback={
          <Skeleton className="rounded-lg">
            <div className="h-[72px] rounded-lg bg-default-300"></div>
          </Skeleton>
        }
      >
        <Navbar />
      </Suspense>
      {!isOnline && (
        <div className="mt-4 flex items-center justify-end text-danger-300">
          <div className="mr-2 flex items-center rounded-2xl bg-danger-300 px-4 py-1 align-middle text-white">
            Offline
            <FaExclamationTriangle className="ml-4" color="#fff" />
          </div>
        </div>
      )}
      {offlineRequests.length > 0 && (
        <div className="mt-4 flex items-center justify-end text-danger-300">
          <div
            onClick={() => sendOfflineRequests()}
            className={`mr-2 flex cursor-pointer items-center rounded-2xl px-4 py-1 align-middle text-white ${
              !loading ? 'bg-danger-300' : ' bg-warning-300'
            }`}
          >
            {!loading && (
              <FaExclamationTriangle className="mr-4" color="#fff" />
            )}
            {loading && (
              <div className="mr-4 h-6 w-6 animate-spin rounded-full border-b-3 border-t-3 border-main" />
            )}
            {offlineRequests.length === 1
              ? '1 operação pendente'
              : `${offlineRequests.length} operações pendentes`}
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-[2560px] px-4 pt-4 sm:px-8 2xl:px-16">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </div>
  )
}

export default Layout
