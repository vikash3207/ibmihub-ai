import type { Metadata } from 'next'
import type { ComponentType } from 'react'
import Link from 'next/link'
import {
  IrpgBadgeSquare,
  IrpgBadgeCircle,
  IrpgBadgePill,
  IrpgBadgeHybrid,
} from '@/components/brand/logo-irpg-badge-concepts'
import { SiteLogoIcon } from '@/components/brand/site-logo-icon'
import { SITE_NAME } from '@/lib/config'

// Temporary internal review page (PR #165, refined in #166, applied in
// #167, and reopened here in #168 for a new exploration round) -- not
// linked from any nav, and excluded from search indexing since it's a
// design review artifact, not real product content. Safe to delete once
// the Product Owner makes a final call on this round too.
export const metadata: Metadata = {
  title: 'Logo Concept Review (Internal)',
  robots: { index: false, follow: false },
}

interface Variant {
  Icon: ComponentType<{ size?: number; className?: string }>
  name: string
  description: string
  navReadability: string
  smallSizeReadability: string
  notes: string
  recommended?: 'header' | 'favicon'
}

const VARIANTS: Variant[] = [
  {
    Icon: IrpgBadgeSquare,
    name: '1. Blue rounded-square iRPG badge',
    description:
      'The primary candidate: a blue rounded-square badge with white "iRPG" text and a small cyan AI spark tucked in the corner.',
    navReadability:
      'Readable, but tight -- four characters have to share the same 32-unit-square footprint the current single-glyph icon uses, so the text runs noticeably smaller and more condensed than a normal wordmark.',
    smallSizeReadability:
      'Weak. At 32px the letterforms are still just barely distinguishable as "iRPG" if you already know what it says; at 16px it degrades into a pale, illegible smudge -- see the 16px preview below directly next to the other variants for a side-by-side comparison.',
    notes: 'Works as a compact header mark if the nav icon is allowed to sit a little larger than 28px; not a favicon candidate on its own.',
  },
  {
    Icon: IrpgBadgeCircle,
    name: '2. Blue circular iRPG badge',
    description:
      'The same idea in a circular badge instead of a rounded square -- included specifically to test circular-badge readability, using iRPGenie\'s own blue/cyan palette and AI spark accent rather than reusing any other brand\'s look.',
    navReadability: 'Slightly tighter than the square version -- a circle\'s corners curve the available text-safe area in further, so the text has to run a touch smaller still to avoid clipping.',
    smallSizeReadability: 'Weakest of the five at small sizes -- the combination of curved edges eating into the text area and four characters in one small mark makes this the first variant to blur into illegibility as size drops.',
    notes: 'Not recommended for header or favicon -- included for completeness/comparison since a circular badge was the specific shape referenced in the request.',
  },
  {
    Icon: IrpgBadgePill,
    name: '3. Compact pill iRPG badge',
    description:
      'A horizontal rounded pill, giving "iRPG" roughly twice the width to work with compared to the square/circle badges, plus a larger, better-separated spark accent.',
    navReadability: 'The most legible "iRPG" text of the five at header/nav height -- the extra width is exactly what the text needed.',
    smallSizeReadability:
      'Not attempted as a favicon -- a wide pill doesn\'t crop into a square favicon slot cleanly at all, independent of text size. This variant is a header-only shape by construction.',
    notes: 'Best "iRPG" text option if the header specifically needs full readable text -- but it cannot double as the favicon/app icon, so it would need a separate favicon-safe mark regardless (see Variant 5).',
    recommended: 'header',
  },
  {
    Icon: IrpgBadgeHybrid,
    name: '4. Hybrid "i" monogram + "RPG" text',
    description:
      'The finalized "i" + spark monogram (unchanged, exactly as shipped in PR #167) on the left, with "RPG" text alongside it in the same badge -- a bridge between the currently-shipped mark and the new iRPG-text idea.',
    navReadability: 'Good -- "RPG" alone needs less horizontal compression than "iRPG," and the monogram half is already proven legible at this size (it\'s the shipped production icon).',
    smallSizeReadability:
      'Degrades gracefully rather than becoming a smudge: even if "RPG" softens at small sizes, the "i" + spark portion stays recognizable on its own, since it\'s the exact shape already validated as favicon-safe.',
    notes: 'The strongest "includes text" option that doesn\'t regress readability compared to what\'s already shipped -- still wider than the current icon, so still a header-only shape, not a drop-in favicon replacement.',
  },
  {
    Icon: SiteLogoIcon,
    name: '5. Favicon-safe fallback (no text)',
    description:
      'The already-shipped production icon (components/brand/site-logo-icon.tsx, unchanged) -- included here as the honest answer to "what should the favicon-safe fallback be." Text-in-icon fundamentally doesn\'t survive 16px/32px compression, as variants 1-3\'s own small-size previews above demonstrate directly.',
    navReadability: 'Unchanged from today -- this is the current production mark.',
    smallSizeReadability: 'Strong -- this is the same shape already tuned for and shipping as the real favicon/app icon.',
    notes: 'Recommended as the favicon regardless of which header variant (if any) is chosen -- no "iRPG" variant in this set holds up at true favicon size.',
    recommended: 'favicon',
  },
]

export default function LogoConceptsPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-blue-600">
            &larr; Back to {SITE_NAME}
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Logo Concept Review: &ldquo;iRPG&rdquo; Badge Exploration</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Internal Product Owner review only -- not linked from the site, and excluded from search indexing
            (<code>robots: noindex</code>). The production logo (the &ldquo;i&rdquo; monogram + AI spark, applied
            in PR #167) is <strong>unchanged</strong> by this page -- everything below is exploration only.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Every variant reuses only the existing brand colors (blue <code>#2563eb</code>, cyan{' '}
            <code>#22d3ee</code>, white) -- no red, no colors outside the existing palette, and no IBM or other
            trademark styling.
          </p>
          <p className="mt-3 max-w-2xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
            <strong>On the reference image:</strong> a competitor&apos;s circular icon-with-text badge was shared
            purely as an example of the general idea that short text can work inside a small icon -- not as a
            style to copy. None of the variants below reuse that (or any other brand&apos;s) color, shape, font, or
            layout: no red anywhere, an AI spark accent no such reference has, and a generic sans-serif rather than
            any borrowed logotype.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {VARIANTS.map(({ Icon, name, description, navReadability, smallSizeReadability, notes, recommended }) => (
            <div
              key={name}
              className={`rounded-2xl border bg-white p-5 shadow-sm ${recommended ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-200'}`}
            >
              <div className="flex flex-wrap items-center gap-4">
                <Icon size={56} />
                <div className="flex flex-col gap-1.5">
                  {/* Nav size (28px, matching the real header), then 32px and 16px favicon-scale previews side by side. */}
                  <div className="flex items-center gap-2">
                    <Icon size={28} />
                    <Icon size={32} />
                    <Icon size={16} />
                  </div>
                  <p className="text-[11px] text-slate-400">nav (28px) &middot; 32px &middot; 16px</p>
                  {recommended && (
                    <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      Recommended for {recommended}
                    </span>
                  )}
                </div>
              </div>

              <h2 className="mt-4 text-base font-semibold text-slate-900">{name}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>

              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">Nav/header readability</dt>
                  <dd className="mt-1 leading-relaxed text-slate-600">{navReadability}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700">32px / 16px readability</dt>
                  <dd className="mt-1 leading-relaxed text-slate-600">{smallSizeReadability}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Notes</dt>
                  <dd className="mt-1 leading-relaxed text-slate-600">{notes}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
          <h2 className="text-sm font-semibold text-blue-900">Recommendation</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            <strong>Header logo:</strong> if visible &ldquo;iRPG&rdquo; text in the icon is a firm goal, Variant 3
            (the pill) reads the most clearly of the four text-bearing options at header height, and Variant 4 (the
            hybrid) is the safer middle ground -- it keeps the already-proven &ldquo;i&rdquo; + spark as an anchor
            and adds &ldquo;RPG&rdquo; beside it rather than compressing all four characters into the same small
            footprint. Variants 1 and 2 (the square and circle full-&ldquo;iRPG&rdquo; badges) are the weakest of
            the four -- both squeeze the same four characters into a smaller, more constrained shape than the pill
            or hybrid have room for.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            <strong>Favicon:</strong> keep the current production icon (Variant 5, the &ldquo;i&rdquo; + spark
            monogram, unchanged from PR #167). None of the &ldquo;iRPG&rdquo; text variants hold up at real 16px/32px
            favicon size -- their own previews above show this directly rather than asking you to take it on faith.
            This isn&apos;t a limitation specific to this design; four legible characters simply don&apos;t fit
            inside a 16px square at any reasonable font weight.
          </p>
        </div>
      </div>
    </div>
  )
}
