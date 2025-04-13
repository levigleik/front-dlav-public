import Loading from '@/app/loading'
import { cn } from '@nextui-org/react'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Selecionar setor',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100svh] flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-md px-4 pt-4 sm:px-8 2xl:px-16">
        <div className="flex h-full flex-1 flex-col">
          <div
            className={cn(
              '',
              'relative z-0 flex flex-col justify-between gap-4 bg-content1 p-4',
              'max-h-[calc(100dvh-8em)] w-full overflow-auto rounded-large shadow-small',
            )}
          >
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
