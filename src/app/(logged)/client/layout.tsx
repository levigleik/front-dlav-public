import Loading from '@/app/loading'
import HeaderTable from '@/components/layout/header.table'
import { columnsFilterable } from '@/utils/functions'
import { cn } from '@nextui-org/react'
import Header from 'components/layout/header'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { columnsClients } from './constants'

export const metadata: Metadata = {
  title: 'Clientes',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header path={'client'} defaultText="Cliente" />
      <div className="flex h-full flex-1 flex-col">
        <div
          className={cn(
            'relative z-0 flex flex-col justify-between gap-4 bg-content1 p-4',
            'max-h-[calc(100dvh-8em)] w-full overflow-auto rounded-large shadow-small',
          )}
        >
          <HeaderTable
            filterColumns={columnsFilterable(columnsClients)}
            path={'client'}
            defaultText="Cliente"
          />
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </div>
    </>
  )
}
