import Loading from '@/app/loading'
import HeaderTable from '@/components/layout/header.table'
import { columnsFilterable } from '@/utils/functions'
import { cn } from '@nextui-org/react'
import Header from 'components/layout/header'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { columnsUsers } from './contants'

export const metadata: Metadata = {
  title: 'Usuários',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header path={'user'} defaultText="Usuário" />
      <div className="flex h-full flex-1 flex-col">
        <div
          className={cn(
            'relative z-0 flex flex-col justify-between gap-4 bg-content1 p-4',
            'max-h-[calc(100dvh-8em)] w-full overflow-auto rounded-large shadow-small',
          )}
        >
          <HeaderTable
            filterColumns={columnsFilterable(columnsUsers)}
            path={'user'}
            defaultText="Usuário"
          />
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </div>
    </>
  )
}
