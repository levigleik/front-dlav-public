import Loading from '@/app/loading'
import { cn } from '@nextui-org/react'
import { Metadata } from 'next'
import { Suspense } from 'react'
import Header from './header'
import HeaderCleanerMonitoring from '@/app/(notlogged)/(cleaner)/tinturaria/(logged)/acompanhamento/header.monitoring'

export const metadata: Metadata = {
  title: 'Tinturaria - Acompanhamento',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header>Acompanhamento dos pedidos</Header>
      <div className="flex h-full flex-1 flex-col">
        <div
          className={cn(
            'relative z-0 flex flex-col justify-between gap-4 bg-content1 p-4',
            'max-h-[calc(100dvh-8em)] w-full overflow-auto rounded-large shadow-small',
          )}
        >
          <HeaderCleanerMonitoring />
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </div>
    </>
  )
}
