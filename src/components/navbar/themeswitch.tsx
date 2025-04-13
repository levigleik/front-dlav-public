'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FaSun } from 'react-icons/fa'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  return (
    // <Tooltip
    //   content={
    //     theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'
    //   }
    //   placement="bottom-end"
    //   color="primary"
    //   className="text-white"
    // >
    <div className="hidden cursor-pointer xl:block">
      <FaSun
        className="text-2xl text-main"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
    </div>
    // </Tooltip>
  )
}

export default ThemeSwitch
