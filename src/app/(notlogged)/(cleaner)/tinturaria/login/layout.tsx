import Loading from '@/app/loading'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Tinturaria - Login',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-full flex-1 flex-col">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </>
  )
}
