import Loading from '@/app/loading'
import { cn } from '@nextui-org/react'
import { Metadata } from 'next'
import { Suspense } from 'react'
import Header from './header'
import HeaderMonitoring from '@/app/(logged)/monitoring/rols/header.monitoring'

export const metadata: Metadata = {
  title: 'Acompanhamento de Rols',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header>Acompanhamento de Rols</Header>
      <div className="flex h-full flex-1 flex-col">
        <div
          className={cn(
            'relative z-0 flex flex-col justify-between gap-4 bg-content1 p-4',
            'max-h-[calc(100dvh-8em)] w-full overflow-auto rounded-large shadow-small',
          )}
        >
          <HeaderMonitoring />
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </div>
    </>
  )
}
