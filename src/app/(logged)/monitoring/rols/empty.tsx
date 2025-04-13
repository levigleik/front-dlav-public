import { FaExclamationTriangle } from 'react-icons/fa'

interface EmptyProps {
  message?: string
}

export default function Empty({
  message = 'Nenhum dado encontrado',
}: EmptyProps) {
  return (
    <div className="min-h-64 flex w-full  flex-col items-center gap-4">
      <div className="min-h-64 flex w-full min-w-max flex-col items-center rounded-xl px-8 py-4">
        <FaExclamationTriangle size={32} />
        <span className="text-lg font-bold">{message}</span>
      </div>
    </div>
  )
}
