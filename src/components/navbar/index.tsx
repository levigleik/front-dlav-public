'use client'

import logo from '@/assets/images/logo.webp'
import { useAuthState } from '@/hook/auth'

import {
  cn,
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
import { useEffect, useState } from 'react'
import {
  FaBuilding,
  FaCogs,
  FaDollarSign,
  FaHome,
  FaMoon,
  FaPaintRoller,
  FaSignOutAlt,
  FaSun,
  FaTshirt,
  FaUser,
  FaUserCog,
  FaUsers,
  FaUserTie,
} from 'react-icons/fa'
import { menuItems } from './constants'
import { fisrtAndSecondLetterName, formatName } from './functions'
import { GiClothes } from 'react-icons/gi'
import { FaArrowRightArrowLeft, FaShirt } from 'react-icons/fa6'
import { PiMonitorFill } from 'react-icons/pi'
import { IoMdPaper } from 'react-icons/io'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { TbWashMachine } from 'react-icons/tb'
import { GrDocumentTime } from 'react-icons/gr'
import { MdBrokenImage } from 'react-icons/md'

const NavbarComp: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { logout, profile, resetSector } = useAuthState()

  const [hoverProfile, setHoverProfile] = useState(false)
  const [hoverNotifications, setHoverNotifications] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    console.log('path', pathname)
  }, [pathname])

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
            .filter((a) => a.permissions?.includes(profile?.role as any))
            .map((item) => (
              <NavbarItem
                key={item.path}
                isActive={
                  item.path === '/'
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
                  {item.icon === 'home' && <FaHome className="mr-2" />}
                  {item.icon === 'monitoring' && (
                    <PiMonitorFill className="mr-2" />
                  )}
                  {item.icon === 'rol' && <IoMdPaper className="mr-2" />}

                  <span className="hidden mdlg:flex">{item.name}</span>
                </Link>
              </NavbarItem>
            ))}
          {menuItems
            .filter((a) => a.dropdown !== null)
            .filter((a) => a.permissions?.includes(profile?.role as any))
            .map((item) => (
              <NavbarItem
                key={item.path}
                isActive={
                  item.path === '/'
                    ? pathname === '/'
                    : pathname.includes(item.path) ||
                      item.path.includes(pathname)
                }
              >
                <Dropdown placement="bottom-end" className="w-lg">
                  <DropdownTrigger title={item.name}>
                    <div className="nav-link flex cursor-pointer items-center text-white hover:text-main-white">
                      {item.icon === 'settings' && <FaCogs className="mr-2" />}
                      {item.icon === 'items' && <FaShirt className="mr-2" />}
                      {item.icon === 'monitoring' && (
                        <PiMonitorFill className="mr-2" />
                      )}

                      <span className="hidden items-center mdlg:flex">
                        {item.name}
                      </span>
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label={`Dropdown navbar ${item.path}`}
                    variant="flat"
                  >
                    {item.dropdown!.map((itemDropdown) => (
                      <DropdownItem
                        key={itemDropdown.path}
                        className={cn(
                          'h-14 cursor-pointer gap-2 dark:text-white dark:hover:text-main-white',
                          `[&>span]:font-semibold ${
                            !itemDropdown.permissions?.includes(
                              profile?.role as any,
                            )
                              ? 'hidden'
                              : ''
                          }`,
                        )}
                        href={itemDropdown.path}
                        as={Link}
                        textValue={itemDropdown.name}
                      >
                        <div className="flex items-center">
                          {itemDropdown.icon === 'user' && (
                            <FaUsers className="mr-2" />
                          )}
                          {itemDropdown.icon === 'client' && (
                            <FaBuilding className="mr-2" />
                          )}
                          {itemDropdown.icon === 'sector' && (
                            <FaUserCog className="mr-2" />
                          )}
                          {itemDropdown.icon === 'employee' && (
                            <FaUserTie className="mr-2" />
                          )}
                          {itemDropdown.icon === 'defect' && (
                            <MdBrokenImage className="mr-2" />
                          )}
                          {itemDropdown.icon === 'record' && (
                            <IoDocumentTextOutline className="mr-2" />
                          )}
                          {itemDropdown.icon === 'log' && (
                            <GrDocumentTime className="mr-2" />
                          )}
                          {itemDropdown.icon === 'washControlEmployee' && (
                            <TbWashMachine className="mr-2" />
                          )}

                          {itemDropdown.icon === 'group' && (
                            <GiClothes className="mr-2" />
                          )}
                          {itemDropdown.icon === 'rol' && (
                            <IoMdPaper className="mr-2" />
                          )}
                          {itemDropdown.icon === 'product' && (
                            <FaTshirt className="mr-2" />
                          )}
                          {itemDropdown.icon === 'priceList' && (
                            <FaDollarSign className="mr-2" />
                          )}
                          {itemDropdown.name}
                        </div>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            ))}
        </NavbarContent>
        <NavbarContent justify="end">
          {/*<NavbarItem className="mr-2">*/}
          {/*  <Dropdown*/}
          {/*    placement="bottom-end"*/}
          {/*    isOpen={hoverNotifications}*/}
          {/*    onOpenChange={(open) => setHoverNotifications(open)}*/}
          {/*    className="w-lg"*/}
          {/*  >*/}
          {/*    <DropdownTrigger*/}
          {/*      onMouseOver={() => setHoverNotifications(true)}*/}
          {/*      onMouseLeave={() => setHoverNotifications(false)}*/}
          {/*      title="Notificações"*/}
          {/*    >*/}
          {/*      <div>*/}
          {/*        <Badge*/}
          {/*          color="danger"*/}
          {/*          content={Math.floor(Math.random() * 8) + 1}*/}
          {/*          isInvisible={Math.floor(Math.random() * 2) === 0}*/}
          {/*          shape="circle"*/}
          {/*        >*/}
          {/*          <FaBell*/}
          {/*            className="cursor-pointer text-2xl"*/}
          {/*            aria-label="Notifications"*/}
          {/*          />*/}
          {/*        </Badge>*/}
          {/*      </div>*/}
          {/*    </DropdownTrigger>*/}
          {/*    <DropdownMenu*/}
          {/*      onMouseOver={() => setHoverNotifications(true)}*/}
          {/*      onMouseLeave={() => setHoverNotifications(false)}*/}
          {/*      aria-label="Notifications"*/}
          {/*      variant="flat"*/}
          {/*    >*/}
          {/*      <DropdownItem*/}
          {/*        key="email"*/}
          {/*        className="h-14 cursor-auto gap-2 [&>span]:font-semibold"*/}
          {/*      >*/}
          {/*        {profile?.email}*/}
          {/*      </DropdownItem>*/}
          {/*    </DropdownMenu>*/}
          {/*  </Dropdown>*/}
          {/*</NavbarItem>*/}
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
                  name={formatName(profile?.name || '') || 'Nome não informado'}
                  description={
                    profile?.role === 'admin'
                      ? 'Administrador'
                      : profile?.role === 'manager'
                        ? 'Gerente'
                        : 'Colaborador'
                  }
                  avatarProps={{
                    name: fisrtAndSecondLetterName(profile?.name || ''),
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
                  key="emailProfile"
                  className="h-14 cursor-auto gap-2 [&>span]:font-semibold"
                >
                  {profile?.email}
                </DropdownItem>
                <DropdownItem
                  as={Link}
                  textValue={'Meu perfil'}
                  key="profile"
                  startContent={<FaUser />}
                  href={`/user/${profile?.userId}`}
                  className="text-default-foreground"
                >
                  Meu perfil
                </DropdownItem>
                <DropdownItem
                  key="theme"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  startContent={theme === 'dark' ? <FaMoon /> : <FaSun />}
                  textValue={`Tema: ${theme === 'dark' ? 'escuro' : 'claro'}`}
                >
                  Tema: {theme === 'dark' ? 'escuro' : 'claro'}
                </DropdownItem>
                <DropdownItem
                  onClick={() => resetSector()}
                  key="reset-sector"
                  startContent={<FaArrowRightArrowLeft />}
                  textValue="Trocar setor"
                  className={profile?.role !== 'worker' ? 'hidden' : ''}
                >
                  Trocar setor
                </DropdownItem>
                <DropdownItem
                  onClick={() => logout()}
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
            .filter((a) => a.permissions?.includes(profile?.role as any))
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
                  {item.icon === 'home' && <FaHome className="mr-2" />}
                  {item.icon === 'monitoring' && (
                    <PiMonitorFill className="mr-2" />
                  )}
                  {item.icon === 'rol' && <IoMdPaper className="mr-2" />}
                  {item.name}
                </Link>
              </NavbarMenuItem>
            ))}
          {menuItems
            .filter((a) => a.dropdown !== null)
            .filter((a) => a.permissions?.includes(profile?.role as any))
            .map((item) => (
              <NavbarItem
                key={item.path}
                isActive={
                  item.path === '/'
                    ? pathname === '/'
                    : pathname.includes(item.path)
                }
              >
                <span className="w-full text-sm text-foreground-500">
                  {item.name}
                </span>
                {item.dropdown!.map((itemDropdown) => (
                  <NavbarMenuItem
                    key={itemDropdown.path}
                    isActive={itemDropdown.path.includes(pathname)}
                    className={`pl-4 ${
                      !itemDropdown.permissions?.includes(profile?.role as any)
                        ? 'hidden'
                        : ''
                    }`}
                  >
                    <Link
                      color="foreground"
                      className="text-md w-full"
                      href={itemDropdown.path}
                      size="lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {itemDropdown.icon === 'user' && (
                        <FaUsers className="mr-2" />
                      )}
                      {itemDropdown.icon === 'client' && (
                        <FaBuilding className="mr-2" />
                      )}
                      {itemDropdown.icon === 'sector' && (
                        <FaUserCog className="mr-2" />
                      )}
                      {itemDropdown.icon === 'defect' && (
                        <MdBrokenImage className="mr-2" />
                      )}
                      {itemDropdown.icon === 'employee' && (
                        <FaUserTie className="mr-2" />
                      )}
                      {itemDropdown.icon === 'record' && (
                        <IoDocumentTextOutline className="mr-2" />
                      )}
                      {itemDropdown.icon === 'log' && (
                        <GrDocumentTime className="mr-2" />
                      )}
                      {itemDropdown.icon === 'washControlEmployee' && (
                        <TbWashMachine className="mr-2" />
                      )}

                      {itemDropdown.icon === 'group' && (
                        <GiClothes className="mr-2" />
                      )}
                      {itemDropdown.icon === 'rol' && (
                        <IoMdPaper className="mr-2" />
                      )}
                      {itemDropdown.icon === 'product' && (
                        <FaTshirt className="mr-2" />
                      )}
                      {itemDropdown.icon === 'priceList' && (
                        <FaDollarSign className="mr-2" />
                      )}
                      {itemDropdown.name}
                    </Link>
                  </NavbarMenuItem>
                ))}
              </NavbarItem>
            ))}
        </NavbarMenu>
      </Navbar>
    </>
  )
}

export default NavbarComp
