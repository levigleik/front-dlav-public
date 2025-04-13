import CardDashboard from './card'
import { PiMonitorFill } from 'react-icons/pi'
import { FaPlus } from 'react-icons/fa'

export default function Home() {
  return (
    <div className="px:0 mx-auto mt-8 flex w-full flex-wrap items-center justify-center gap-8 bg-transparent lg:px-8 3xl:px-64">
      <CardDashboard
        href="/tinturaria/novo"
        text="Registrar"
        icon={<FaPlus size={38} className="text-main" />}
      />
      <CardDashboard
        href="/tinturaria/acompanhamento"
        text="Acompanhamento"
        icon={<PiMonitorFill size={38} className="text-main" />}
      />
    </div>
  )
}
