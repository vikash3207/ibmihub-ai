import type { MouseEvent } from 'react'

/**
 * Pure nav-link data and logic (Site-wide Navigation and Section Landing
 * Page Visual Upgrade). Deliberately a plain module with no 'use client'
 * and no component imports -- components/site-nav-links.tsx (desktop pill
 * nav) and components/site-mobile-nav.tsx (mobile panel) both render this
 * same data instead of each defining their own copy, and
 * scripts/site-navigation-regression.ts can import and execute
 * handleAiTutorNavClick() directly.
 *
 * That last point is also *why* this had to be its own file: importing
 * components/site-nav-links.tsx itself (a 'use client' component) pulls in
 * components/ai-tutor/ai-tutor-panel-provider.tsx, which transitively
 * imports a 'use server' action module -- and Node's `server-only` package
 * throws unconditionally outside a bundler's `react-server` export
 * condition (see node_modules/server-only/index.js), so a plain `tsx`
 * script importing that chain crashes before any assertion runs. This
 * module has no such chain, so it's safe to import from a standalone
 * script the same way lib/deep-dive-render.ts and
 * lib/insight-structured-data.ts already are.
 */

export interface NavAccentClasses {
  activeBg: string
  activeText: string
  hoverBg: string
  hoverText: string
  ring: string
}

export interface NavLinkDef {
  href: string
  label: string
  accent: NavAccentClasses
  /** AI Tutor keeps a restrained cyan tint even when not active/hovered -- every other item stays neutral until interacted with. */
  alwaysAccented?: boolean
  /**
   * When set, the item opens the shared AI Tutor panel in place instead of
   * navigating (PR #180). `href` is still required and still rendered as a
   * real anchor, so middle-click / cmd-click / "open in new tab" keep working
   * and the canonical /ai-tutor route stays reachable.
   */
  opensAiTutorPanel?: boolean
}

/**
 * One static accent-class bundle per section (Site-wide Navigation and
 * Section Landing Page Visual Upgrade). Full static strings, not
 * interpolated -- see lib/section-theme.ts's header comment for why.
 * Deliberately restrained: every item's *default* state (besides AI Tutor)
 * is plain neutral text with no background, so the row never reads as a
 * permanently-filled rainbow -- color only appears on hover and for the
 * current page.
 */
const DASHBOARD_ACCENT: NavAccentClasses = {
  activeBg: 'bg-blue-50',
  activeText: 'text-blue-700',
  hoverBg: 'hover:bg-blue-50/70',
  hoverText: 'hover:text-blue-700',
  ring: 'focus-visible:ring-blue-600',
}
const LEARN_ACCENT: NavAccentClasses = {
  activeBg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
  activeText: 'text-indigo-700',
  hoverBg: 'hover:bg-indigo-50/60',
  hoverText: 'hover:text-indigo-700',
  ring: 'focus-visible:ring-indigo-600',
}
const DEEP_DIVES_ACCENT: NavAccentClasses = {
  activeBg: 'bg-gradient-to-r from-indigo-50 to-violet-50',
  activeText: 'text-violet-700',
  hoverBg: 'hover:bg-violet-50/60',
  hoverText: 'hover:text-violet-700',
  ring: 'focus-visible:ring-violet-600',
}
const INSIGHTS_ACCENT: NavAccentClasses = {
  activeBg: 'bg-gradient-to-r from-violet-50 to-cyan-50',
  activeText: 'text-violet-700',
  hoverBg: 'hover:bg-cyan-50/60',
  hoverText: 'hover:text-violet-700',
  ring: 'focus-visible:ring-violet-600',
}
const PRACTICE_ACCENT: NavAccentClasses = {
  activeBg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
  activeText: 'text-emerald-700',
  hoverBg: 'hover:bg-emerald-50/60',
  hoverText: 'hover:text-emerald-700',
  ring: 'focus-visible:ring-emerald-600',
}
const AI_TUTOR_ACCENT: NavAccentClasses = {
  activeBg: 'bg-cyan-100',
  activeText: 'text-cyan-900',
  hoverBg: 'hover:bg-cyan-100/70',
  hoverText: 'hover:text-cyan-800',
  ring: 'focus-visible:ring-cyan-600',
}
const CONTACT_ACCENT: NavAccentClasses = {
  activeBg: 'bg-gradient-to-r from-slate-100 to-blue-50',
  activeText: 'text-blue-700',
  hoverBg: 'hover:bg-blue-50/60',
  hoverText: 'hover:text-blue-700',
  ring: 'focus-visible:ring-blue-600',
}

const LOGGED_IN_LINKS: NavLinkDef[] = [
  { href: '/dashboard', label: 'Dashboard', accent: DASHBOARD_ACCENT },
  { href: '/learn', label: 'Learning Center', accent: LEARN_ACCENT },
  { href: '/deep-dives', label: 'Deep Dives', accent: DEEP_DIVES_ACCENT },
  { href: '/insights', label: 'IBM i Insights', accent: INSIGHTS_ACCENT },
  { href: '/practice', label: 'Practice', accent: PRACTICE_ACCENT },
  { href: '/ai-tutor', label: 'AI Tutor', accent: AI_TUTOR_ACCENT, alwaysAccented: true, opensAiTutorPanel: true },
  { href: '/contact', label: 'Contact Us', accent: CONTACT_ACCENT },
]

// AI Tutor and Practice both link straight to their real, already-protected
// routes for signed-out visitors too (Homepage Hierarchy and Signed-Out
// Feature Discovery) -- those pages now render a public preview instead of
// redirecting (app/(authenticated)/ai-tutor/page.tsx,
// app/(authenticated)/practice/page.tsx), so a signed-out visitor sees a
// preview and a signed-in one lands on the real feature directly. No second
// auth check or redirect is introduced here.
const LOGGED_OUT_LINKS: NavLinkDef[] = [
  { href: '/learn', label: 'Learning Center', accent: LEARN_ACCENT },
  { href: '/deep-dives', label: 'Deep Dives', accent: DEEP_DIVES_ACCENT },
  { href: '/insights', label: 'IBM i Insights', accent: INSIGHTS_ACCENT },
  { href: '/practice', label: 'Practice', accent: PRACTICE_ACCENT },
  { href: '/ai-tutor', label: 'AI Tutor', accent: AI_TUTOR_ACCENT, alwaysAccented: true, opensAiTutorPanel: true },
  { href: '/contact', label: 'Contact Us', accent: CONTACT_ACCENT },
]

export function getNavLinks(isLoggedIn: boolean): NavLinkDef[] {
  return isLoggedIn ? LOGGED_IN_LINKS : LOGGED_OUT_LINKS
}

export function isNavLinkActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Shared AI Tutor click-interception handler (PR #180, unchanged logic --
 * only extracted into its own named function so both the desktop pill nav
 * and the mobile nav panel call the exact same code instead of maintaining
 * two copies that could drift apart). Left click opens the shared panel in
 * place; any modified click (new tab, new window, download) or non-primary
 * button falls through to the real anchor navigation untouched.
 */
export function handleAiTutorNavClick(event: MouseEvent<HTMLAnchorElement>, openPanel: () => void) {
  if (event.defaultPrevented) return
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
  event.preventDefault()
  // No explicit context: the provider resolves whatever the current
  // page registered (PR #181), so the Tutor opens knowing the lesson or Deep Dive being read.
  openPanel()
}

export function navItemClasses(link: NavLinkDef, isActive: boolean, variant: 'desktop' | 'mobile' = 'desktop'): string {
  const base = [
    'inline-flex items-center rounded-full transition-all duration-150 motion-reduce:transition-none active:scale-[0.97]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
    link.accent.ring,
    variant === 'desktop' ? 'px-3 py-1.5 text-sm' : 'w-full px-4 py-2.5 text-sm',
  ]

  if (isActive) {
    base.push('font-semibold shadow-sm', link.accent.activeBg, link.accent.activeText)
  } else if (link.alwaysAccented) {
    base.push('font-medium bg-cyan-50/60 text-cyan-700', link.accent.hoverBg, link.accent.hoverText)
  } else {
    base.push('font-medium text-slate-600', link.accent.hoverBg, link.accent.hoverText)
  }

  return base.join(' ')
}
