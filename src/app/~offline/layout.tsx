import Navbar from '@/components/navbar'
import { cn } from '@nextui-org/react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-[2560px] px-4 pt-4 sm:px-8 2xl:px-16">
        <div className="flex h-full flex-1 flex-col">
          <div
            className={cn(
              '',
              'relative z-0 flex flex-col justify-between gap-4 bg-content1 p-4',
              'max-h-[calc(100dvh-8em)] w-full overflow-auto rounded-large shadow-small',
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
