import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { SITE_NAME } from '@/lib/config'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - IBM i Learning and AI Assistance`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'IBMiHub AI helps beginners and working IBM i developers learn with structured lessons and AI guidance.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`h-full ${inter.variable}`}>
      <body className="h-full bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
