import { parse } from 'cookie'
import { type NextRequest, NextResponse } from 'next/server'
import { routesFront } from './utils/constants'

const isAuthorized = (
  permissions: string[],
  userPermissions: string[],
): boolean => {
  return permissions?.some((permission) => userPermissions.includes(permission))
}

const ignoreRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
]
const ignoredPaths = /^\/((?!api|_next\/static|_next\/image|favicon.ico).)/

const sortedRoutes = routesFront.sort((a, b) => b.path.length - a.path.length)

const protectedRoutes = sortedRoutes.filter((a) => a.private)

const publicRoutes = sortedRoutes.filter((a) => !a.private)

export default function middleware(req: NextRequest) {
  const cookies = parse(req.cookies.toString() ?? '')
  const role = cookies.role
  const signed = cookies.signed
  const cleanerSigned = cookies.cleanerSigned
  const sector = cookies.sector

  const protectedRoute = protectedRoutes.find((route) =>
    req.nextUrl.pathname.startsWith(route.path),
  )

  const publicRoute = publicRoutes.find((route) =>
    req.nextUrl.pathname.startsWith(route.path),
  )

  const absoluteURL = new URL('/', req.nextUrl.origin)

  if (signed && role === 'worker' && !sector) {
    if (req.nextUrl.pathname !== '/sector-select') {
      const sectorSelect = new URL('/sector-select', req.nextUrl.origin)
      return NextResponse.redirect(sectorSelect)
    }
  }

  if (signed && role === 'worker' && sector) {
    if (req.nextUrl.pathname === '/sector-select') {
      return NextResponse.redirect(absoluteURL.toString())
    }
  }
  if (publicRoute && signed) {
    if (
      req.nextUrl.pathname !== '/' &&
      !req.nextUrl.pathname.startsWith('/tinturaria')
    ) {
      return NextResponse.redirect(absoluteURL.toString())
    }
  }

  if (!signed && publicRoute) {
    return NextResponse.next()
  }

  if (!signed && protectedRoute) {
    if (req.nextUrl.pathname !== '/login') {
      const loginURL = new URL('/login', req.nextUrl.origin)
      const originalURL = req.nextUrl.pathname + req.nextUrl.search
      // // ignore if redirect is already login or only /
      // if (ignoreRoutes.includes(originalURL) || originalURL === '/') {
      //   return NextResponse.next()
      // }
      loginURL.searchParams.append('redirect', encodeURIComponent(originalURL))
      return NextResponse.redirect(loginURL.toString())
    }
  }

  if (
    role &&
    protectedRoute &&
    !isAuthorized(protectedRoute.permissions, [role])
  ) {
    if (req.nextUrl.pathname !== '/') {
      return NextResponse.redirect(absoluteURL.toString())
    }
  }

  if (!cleanerSigned && req.nextUrl.pathname.startsWith('/tinturaria')) {
    if (
      req.nextUrl.pathname !== '/tinturaria/login' &&
      req.nextUrl.pathname !== '/tinturaria/registrar'
    ) {
      const loginURL = new URL('/tinturaria/login', req.nextUrl.origin)
      const originalURL = req.nextUrl.pathname + req.nextUrl.search
      loginURL.searchParams.append('redirect', encodeURIComponent(originalURL))
      return NextResponse.redirect(loginURL.toString())
    }
  }
  if (cleanerSigned && req.nextUrl.pathname === '/tinturaria/login') {
    const tinturariaURL = new URL('/tinturaria', req.nextUrl.origin)
    return NextResponse.redirect(tinturariaURL.toString())
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/user',
    '/client',
    '/sector',
    '/sector-select',
    '/product',
    '/rol',
    '/priceList',
    '/monitoring',
    '/record',
    '/log',
    '/employee',
    '/washControlEmployee',
    '/login',
    '/worker',
    '/defect',
    '/reset-password',
    '/change-password',
    '/monitoring/:path*',
    '/tinturaria',
    '/defect/:path*',
    '/worker/:path*',
    '/tinturaria/:path*',
    '/dashboard/:path*',
    '/user/:path*',
    '/employee/:path*',
    '/washControlEmployee/:path*',
    '/client/:path*',
    '/sector/:path*',
    '/product/:path*',
    '/rol/:path*',
    '/priceList/:path*',
  ],
}
