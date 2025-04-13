import Loading from '@/app/loading'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Tinturaria - Registrar',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto w-full max-w-[2560px] px-4 pt-4 sm:px-8 2xl:px-16">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </>
  )
}
