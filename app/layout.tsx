import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { SITE_NAME } from '@/lib/config'
import { AiTutorPanelProvider } from '@/components/ai-tutor/ai-tutor-panel-provider'
import { EmbeddedAiTutorPanel } from '@/components/ai-tutor/embedded-ai-tutor-panel'

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
        {/*
          Mounted at the root, not in app/learn/layout.tsx or
          app/(authenticated)/layout.tsx: those are sibling route-group
          layouts, not nested, so a provider placed in either one alone
          would lose its conversation state when navigating between a
          lesson page and /practice. The root layout is the only layout
          both trees share (Spec 001 v1.1 AI-TUTOR-FR-024; see
          planning/EMBEDDED_AI_TUTOR_PANEL_PROPOSAL.md Section 3).
        */}
        <AiTutorPanelProvider>
          {children}
          <EmbeddedAiTutorPanel />
        </AiTutorPanelProvider>
      </body>
    </html>
  )
}
