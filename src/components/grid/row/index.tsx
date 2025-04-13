'use client'
import { cn } from '@nextui-org/react'

interface RowProps {
  className?: string
  children?: React.ReactNode
}

export const Row: React.FC<RowProps> = ({ className = '', children }) => {
  const classes = cn(`w-full grid gap-8 grid-cols-1 md:grid-cols-2`, className)

  return <div className={classes}>{children}</div>
}
