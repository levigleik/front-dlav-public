import { Spinner } from '@nextui-org/react'

const Loading = () => {
  return (
    <div className="fixed inset-0 z-10 flex h-full w-full items-center justify-center bg-gradient-to-b from-slate-300 to-main-white opacity-50">
      <Spinner />
    </div>
  )
}

export default Loading
