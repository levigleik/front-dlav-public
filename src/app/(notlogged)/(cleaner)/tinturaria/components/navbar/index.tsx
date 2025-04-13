'use client'

import logo from '@/assets/images/logo.webp'
import { useAuthState } from '@/hook/auth'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  User,
} from '@nextui-org/react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { FaMoon, FaPlus, FaSignOutAlt, FaSun } from 'react-icons/fa'
import { menuItems } from './constants'
import {
  fisrtAndSecondLetterName,
  formatName,
} from '@/components/navbar/functions'
import { PiMonitorFill } from 'react-icons/pi'

const NavbarCleanerComp: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { logoutCleaner, profileCleaner } = useAuthState()

  const [hoverProfile, setHoverProfile] = useState(false)
  const { theme, setTheme } = useTheme()

  const companyName = useMemo(() => {
    return profileCleaner?.fantasyName || profileCleaner?.corporateName
  }, [profileCleaner])

  return (
    <>
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        classNames={{
          item: [
            '[&>.nav-link]:data-[active=true]:text-main-white',
            '[&>.nav-link]:data-[active=true]:underline [&>.nav-link]:data-[active=true]:underline-offset-8',
            '[&>.nav-link]:hover:text-main-white [&>.nav-link]:transtion-all [&>.nav-link]:duration-300 [&>.nav-link]:ease-in-out',
            '[&>.nav-link]:hover:underline [&>.nav-link]:hover:underline-offset-8',
            'flex flex-col ',
          ],
          wrapper:
            'mx-auto w-full max-w-[2560px] px-4 md:px-8 2xl:px-16 bg-main-300',
        }}
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Fechar' : 'Abrir'}
            className="md:hidden"
          />
          <NavbarBrand className="text-2xl light:text-gray-800 dark:text-white">
            <Image src={logo} alt="Logo" width={190} height={190} />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden gap-4 md:flex" justify="center">
          {menuItems
            .filter((a) => !a.dropdown)
            .map((item) => (
              <NavbarItem
                key={item.path}
                isActive={
                  item.path === '/tinturaria/novo'
                    ? pathname === '/'
                    : pathname.includes(item.path)
                }
              >
                <Link
                  className="nav-link text-white"
                  color="foreground"
                  href={item.path}
                  title={item.name}
                >
                  {item.icon === 'new' && <FaPlus className="mr-2" />}
                  {item.icon === 'monitoring' && (
                    <PiMonitorFill className="mr-2" />
                  )}

                  <span className="hidden mdlg:flex">{item.name}</span>
                </Link>
              </NavbarItem>
            ))}
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Dropdown
              placement="bottom-end"
              isOpen={hoverProfile}
              onOpenChange={(open) => setHoverProfile(open)}
              className="w-lg"
            >
              <DropdownTrigger
                onMouseOver={() => setHoverProfile(true)}
                onMouseLeave={() => setHoverProfile(false)}
              >
                <User
                  name={formatName(companyName || '') || ''}
                  description={companyName || 'Nome não informado'}
                  avatarProps={{
                    name: fisrtAndSecondLetterName(
                      companyName || 'Nome não informado',
                    ),
                    showFallback: true,
                    className: 'mr-2',
                  }}
                  classNames={{
                    description: 'hidden 2xs:block text-main-white',
                    name: 'hidden 2xs:block',
                  }}
                />
              </DropdownTrigger>
              <DropdownMenu
                onMouseOver={() => setHoverProfile(true)}
                onMouseLeave={() => setHoverProfile(false)}
                aria-label="Perfil"
                variant="flat"
              >
                <DropdownItem
                  key="theme"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  startContent={theme === 'dark' ? <FaMoon /> : <FaSun />}
                  textValue={`Tema: ${theme === 'dark' ? 'escuro' : 'claro'}`}
                >
                  Tema: {theme === 'dark' ? 'escuro' : 'claro'}
                </DropdownItem>
                <DropdownItem
                  onClick={() => logoutCleaner()}
                  key="logout"
                  color="danger"
                  startContent={<FaSignOutAlt className="text-danger" />}
                  textValue={'Sair'}
                >
                  Sair
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu className={'pt-8'}>
          {menuItems
            .filter((a) => !a.dropdown)
            .map((item) => (
              <NavbarMenuItem
                key={item.path}
                isActive={item.path.includes(pathname)}
              >
                <Link
                  color="foreground"
                  className="nav-link w-full"
                  href={item.path}
                  size="lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon === 'new' && <FaPlus className="mr-2" />}
                  {item.icon === 'monitoring' && (
                    <PiMonitorFill className="mr-2" />
                  )}
                  {item.name}
                </Link>
              </NavbarMenuItem>
            ))}
        </NavbarMenu>
      </Navbar>
    </>
  )
}

export default NavbarCleanerComp
