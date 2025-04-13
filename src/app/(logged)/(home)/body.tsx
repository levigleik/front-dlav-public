'use client'
import { FaBuilding, FaMotorcycle, FaUsers } from 'react-icons/fa'
import { IoMdPaper } from 'react-icons/io'
import { IoDocumentTextOutline, IoNewspaperOutline } from 'react-icons/io5'
import CardDashboard from './card'
import { useAuthState } from '@/hook/auth'
import { PiMonitorFill } from 'react-icons/pi'

export default function HomeBody() {
  const { profile } = useAuthState()
  if (!profile) return null

  return (
    <>
      <CardDashboard
        href="/rol/new"
        text="Lançamento de Rol"
        icon={<IoMdPaper size={38} className="text-main" />}
      />
      <CardDashboard
        href="/record"
        text="Registros"
        icon={<IoDocumentTextOutline size={38} className="text-main" />}
      />
      <CardDashboard
        href="/user"
        text="Usuários"
        icon={<FaUsers size={38} className="text-main" />}
      />
      <CardDashboard
        href="/rol"
        text="Lista de Rols"
        icon={
          <div className="flex">
            <IoMdPaper size={38} className="text-main" />
            <IoNewspaperOutline size={38} className="text-main" />
          </div>
        }
      />
      <CardDashboard
        href="/monitoring/rols"
        text="Acompanhamento de Rols"
        icon={<PiMonitorFill size={38} className="text-main" />}
      />
      <CardDashboard
        href="/client"
        text="Clientes"
        icon={<FaBuilding size={38} className="text-main" />}
      />
      {profile?.role === 'worker' && (
        <CardDashboard
          href="/worker"
          text="Rols para entrega"
          icon={<FaMotorcycle size={38} className="text-main" />}
        />
      )}
    </>
  )
}
