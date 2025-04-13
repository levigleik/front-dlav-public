'use client'
import { cn } from '@nextui-org/react'
import Link from 'next/link'
import { routesFront } from '@/utils/constants'
import { useAuthState } from '@/hook/auth'

interface CardDashboardProps {
  text: string
  icon: React.ReactNode
  href: string
}

const CardDashboard: React.FC<CardDashboardProps> = ({ href, icon, text }) => {
  const { profile } = useAuthState()
  if (!profile) return null
  const permission = routesFront
    .find((route) => route.path.split('/')[1] === href.split('/')[1])
    ?.permissions?.includes(profile?.role)

  if (!permission) return null
  return (
    <Link
      href={href}
      className={cn(
        'flex h-[210px] w-[320px] items-center justify-center',
        'rounded-md border-2 border-main bg-default-50 p-8 shadow-md',
        'cursor-pointer text-2xl font-bold transition-all',
        'hover:scale-105 hover:bg-default-100',
        'text-center 3xl:h-[280px] 3xl:w-[380px]',
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        {icon}
        <span>{text}</span>
      </div>
    </Link>
  )
}

export default CardDashboard
