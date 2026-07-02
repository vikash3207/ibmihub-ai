import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SITE_NAME } from '@/lib/config'

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — IBM i Learning and AI Assistance`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'IBMiHub AI helps beginners and working IBM i developers learn with structured lessons and AI guidance.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  )
}
