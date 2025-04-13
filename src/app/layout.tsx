import Loading from '@/app/loading'
import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import { Suspense } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { Providers } from './providers'

import './globals.css'

const font = Montserrat({ weight: '400', subsets: ['latin'] })

const APP_NAME = "D'Lav"
const APP_TITLE_TEMPLATE = "D'Lav | %s"
const APP_DESCRIPTION = "D'Lav | Soluções em higienização"

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DESCRIPTION,
    template: APP_TITLE_TEMPLATE,
  },
  icons: {
    apple: '/assets/images/icon.png',
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#222',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={font.className}>
        <Providers>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </Providers>
      </body>
    </html>
  )
}
