import Loading from '@/app/loading'
import { Metadata } from 'next'
import { Suspense } from 'react'
import NavbarCleanerComp from '@/app/(notlogged)/(cleaner)/tinturaria/components/navbar'

export const metadata: Metadata = {
  title: 'Tinturaria',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarCleanerComp />
      <div className="mx-auto w-full max-w-[2560px] px-4 pt-4 sm:px-8 2xl:px-16">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </>
  )
}
