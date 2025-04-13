import Loading from '@/app/loading'
import { cn } from '@nextui-org/react'
import { Metadata } from 'next'
import { Suspense } from 'react'
import BottomFunc from './bottom'
import Header from './header'

export const metadata: Metadata = {
  title: 'Rols',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header path={'/rol'}>Lançamento de Rol</Header>
      <div className="flex h-full flex-1 flex-col">
        <div
          className={cn(
            'relative z-0 flex flex-col justify-between gap-4 bg-content1 p-4',
            'max-h-[calc(100dvh-8em)] w-full overflow-auto rounded-large shadow-small',
          )}
        >
          <Suspense fallback={<Loading />}>{children}</Suspense>
          <BottomFunc />
        </div>
      </div>
    </>
  )
}
