import type { Metadata } from 'next'
import type { ComponentType } from 'react'
import Link from 'next/link'
import {
  LogoConceptTerminal,
  LogoConceptMonogram,
  LogoConceptChatPrompt,
  LogoConceptCodeBrackets,
  LogoConceptChip,
  LogoConceptTwoTone,
  LogoRefinedPrimary,
  LogoRefinedTechnical,
  LogoRefinedBadge,
  LogoRefinedFavicon,
} from '@/components/brand/logo-concepts'
import { SITE_NAME } from '@/lib/config'

// Temporary internal review page (PR #165, refined in PR #166) -- not
// linked from any nav, and deliberately excluded from search indexing
// since it's a design review artifact, not real product content. Safe to
// delete once the Product Owner makes a final call (or decides to keep
// the current mark).
export const metadata: Metadata = {
  title: 'Logo Concept Review (Internal)',
  robots: { index: false, follow: false },
}

interface Concept {
  Icon: ComponentType<{ size?: number; className?: string }>
  name: string
  concept: string
  whyItWorks: string
  weakness: string
  faviconNote: string
  recommended?: boolean
}

interface RefinedVariant {
  Icon: ComponentType<{ size?: number; className?: string }>
  name: string
  description: string
  worksBestFor: string
  faviconSuitable: string
  navSuitable: string
  marketingOnly: string
  recommended?: boolean
}

const CONCEPTS: Concept[] = [
  {
    Icon: LogoConceptTerminal,
    name: '1. Terminal / 5250 screen + AI spark',
    concept:
      'A command-prompt cursor (">_") inside the existing blue rounded-square badge, with a small cyan spark in the corner as the AI accent.',
    whyItWorks:
      'The ">_" prompt is an immediately recognizable "this is about a terminal/command-line system" cue -- exactly what IBM i and 5250 work looks like day to day -- while the spark reads as "AI-assisted" without needing any text. Two simple, bold shapes, both legible at very small sizes.',
    weakness:
      'A command prompt is a fairly generic "developer tool" symbol on its own -- it signals "technical/terminal" more strongly than it signals "IBM i" specifically, and relies on the spark + brand context (wordmark, colors) to carry the "learning platform" and "AI" meaning.',
    faviconNote:
      'Excellent at 16-32px -- both shapes are bold strokes with no fine detail, and the spark stays a clear, distinct dot of color even when tiny.',
    recommended: true,
  },
  {
    Icon: LogoConceptMonogram,
    name: '2. Lowercase "i" monogram + AI spark',
    concept:
      'A bold lowercase "i" (for IBM i) where the dot above the stem becomes the cyan spark instead of a plain circle.',
    whyItWorks:
      'This is the closest to the current favicon (app/icon.tsx already uses an "i" stem with a cyan accent dot), so it has real continuity with the existing brand mark -- this concept mainly refines what already exists rather than replacing it outright. The "i" is a direct, literal reference to "IBM i."',
    weakness:
      'A lone lowercase "i" is a very common glyph shape (many other brands use a similar dotted-i mark) -- it\'s the least visually distinctive of the six options, and doesn\'t on its own suggest "terminal" or "coding" the way a prompt or brackets would.',
    faviconNote:
      'Very strong at favicon size -- this is essentially what the site already ships today, and it has already been tuned for 16px legibility.',
  },
  {
    Icon: LogoConceptChatPrompt,
    name: '3. Command prompt + chat bubble',
    concept:
      'A smaller ">" cursor paired with a distinct chat-bubble shape (with a tail) in cyan, positioned side by side -- prompt on the left, chat response on the right.',
    whyItWorks:
      'This is the most literal illustration of "command-line learning with an AI tutor answering" -- the chat bubble is an unambiguous "conversation/help" symbol that most people recognize instantly, pairing cleanly with the terminal cursor\'s "this is a coding/command environment" cue.',
    weakness:
      'Two distinct shapes side by side is more visually busy than the other concepts, and at very small sizes the chat bubble\'s tail can start to blur into a soft blob rather than a crisp triangle -- the two shapes need real separation to both stay legible.',
    faviconNote:
      'Good, but the tightest of the six at 16px -- the chat bubble tail is the one detail worth checking on an actual rendered favicon, not just the SVG source, before finalizing.',
  },
  {
    Icon: LogoConceptCodeBrackets,
    name: '4. Code brackets + subtle spark',
    concept:
      'Angle brackets ("< >") suggesting source code, with a small, deliberately subtle spark tucked in one corner rather than as a dominant second element.',
    whyItWorks:
      'Angle brackets read as "code" broadly (RPGLE, SQL, CL are all still "code" to a learner), and keeping the spark small and secondary avoids the two-competing-shapes problem Concept 3 has -- this stays the calmest, most "professional dev tool" of the six.',
    weakness:
      'Angle brackets are a generic "programming" symbol used across countless unrelated products (many editors/frameworks use a similar mark) -- it says "this is about code" more than it says "this is about IBM i" or "AI-assisted," so it leans the least on this platform\'s specific identity.',
    faviconNote: 'Strong at small sizes -- two bold strokes plus one small accent, nothing that needs fine detail to read correctly.',
  },
  {
    Icon: LogoConceptChip,
    name: '5. Chip/card + terminal line',
    concept:
      'A "hardware chip" card (a white rounded card with small pin notches on both edges) containing one short terminal line and a cyan node dot -- a nod to the existing generic circuit-style icon it would replace.',
    whyItWorks:
      'It keeps a visual thread back to the current icon\'s "chip/circuit" feeling (so the rebrand doesn\'t feel jarring) while adding a terminal line and AI node inside it to make the connection to IBM i and AI Tutor much more explicit than a bare generic chip glyph.',
    weakness:
      'This is the most detailed of the six concepts -- four small pin notches plus an inner card plus a line plus a dot is a lot of distinct shapes for one small mark, and it\'s the one most likely to lose legibility or look like a smudge at 16px favicon size rather than a chip.',
    faviconNote:
      'Weakest of the six at favicon scale -- the pin notches in particular are the kind of fine detail the design constraints explicitly warn against. Would need simplification (likely dropping the pins entirely) before it could ship as a favicon.',
  },
  {
    Icon: LogoConceptTwoTone,
    name: '6. Two-tone learning badge',
    concept:
      'The badge itself is split into two color halves -- brand blue and cyan/teal -- with a terminal cursor on the blue side and a spark on the cyan (now white-on-cyan) side.',
    whyItWorks:
      'Splitting the badge into two brand colors is a distinctive silhouette on its own, even before you look at the shapes inside it -- it would be recognizable in a nav bar purely by its two-tone color block, which is a nice property for quick visual scanning. It still carries both the terminal and AI cues from Concept 1, just restructured.',
    weakness:
      'The two-tone split slightly reduces contrast for the shapes on the cyan half (white-on-cyan reads a little softer than white-on-blue), and a hard vertical color seam is a stronger stylistic departure from the current single-color badge than any of the other five concepts -- more of a rebrand, less of a refinement.',
    faviconNote:
      'Good -- the color split itself stays clearly visible even at 16px (arguably the most recognizable-by-silhouette-alone of the six), though the white spark on the cyan half has slightly less contrast than white-on-blue elsewhere in this set.',
  },
]

const REFINED_VARIANTS: RefinedVariant[] = [
  {
    Icon: LogoRefinedPrimary,
    name: 'A. Primary recommended icon',
    description:
      'The refined "i" monogram with a cyan AI spark -- clean, simple, no extra detail. This is the version most likely to become the final nav icon and favicon.',
    worksBestFor: 'Nav bar, favicon, browser tab, app icon -- anywhere the mark needs to read instantly at a glance.',
    faviconSuitable: 'Yes -- two simple shapes, no fine detail, holds up cleanly at 16px and 32px.',
    navSuitable: 'Yes -- this is the primary candidate for the header icon.',
    marketingOnly: 'No -- this is the general-purpose, all-sizes version.',
    recommended: true,
  },
  {
    Icon: LogoRefinedTechnical,
    name: 'B. Stronger IBM i variant (technical cue)',
    description:
      'Same monogram and spark, plus a subtle, low-opacity terminal-cursor underscore beneath the stem, as an extra nod to command-line/IBM i work.',
    worksBestFor:
      'Anywhere the primary icon works, if the Product Owner wants a slightly stronger "terminal" cue without changing the overall silhouette.',
    faviconSuitable:
      'Mostly -- the underscore is thin and low-opacity so it doesn\'t compete with the spark, but it\'s the one detail worth double-checking on an actual rendered 16px favicon before finalizing.',
    navSuitable: 'Yes.',
    marketingOnly: 'No.',
  },
  {
    Icon: LogoRefinedBadge,
    name: 'C. Large-size "iRPG" badge (marketing use only)',
    description:
      'The monogram acting as the "i", followed by "RPG" in a matching bold weight -- answers the Product Owner\'s question about including "iRPG" text, but only as a wider badge lockup, never inside the small icon itself.',
    worksBestFor: 'Social share image, landing page badge, marketing graphic, footer badge -- anywhere there\'s room for a wider mark.',
    faviconSuitable: 'No -- not attempted. The aspect ratio and text detail are not designed to survive a 16px square crop.',
    navSuitable: 'Not recommended -- too wide for the compact header icon slot next to the existing wordmark.',
    marketingOnly: 'Yes -- this is explicitly the large-size-only variant the design guidance asked for.',
  },
  {
    Icon: LogoRefinedFavicon,
    name: 'D. Favicon-safe simplified variant',
    description:
      'An even further reduced version -- a thicker stem and a plain filled dot instead of a 4-point spark -- for the specific case where 16px/32px rendering needs the absolute simplest possible shapes.',
    worksBestFor: 'The literal favicon/app-icon file itself, if the spark\'s points in the primary variant ever look soft in a real rendered favicon test.',
    faviconSuitable: 'Yes -- this is the variant built specifically for that job.',
    navSuitable:
      'Acceptable, but the primary icon\'s spark is more distinctive at nav size (32-40px) where the extra detail reads fine -- this variant is a bit plainer than necessary there.',
    marketingOnly: 'No.',
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
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Logo Concept Review</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Internal Product Owner review only -- not linked from the site, and excluded from search indexing
            (<code>robots: noindex</code>). None of these have replaced the production mark -- the current header
            icon and favicon are unchanged.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Every concept reuses only the existing brand colors (blue <code>#2563eb</code>, cyan{' '}
            <code>#22d3ee</code>, white) and is drawn as plain inline SVG -- no image assets, no new dependency,
            and no IBM logo/trademark styling anywhere in this set.
          </p>
          <p className="mt-3 max-w-2xl rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3 text-sm leading-relaxed text-blue-900">
            <strong>Decision so far:</strong> the Product Owner reviewed the original six concepts below and
            selected <strong>Concept 2 (the &ldquo;i&rdquo; monogram + AI spark)</strong> to refine further -- see
            the four refined variants beneath the original set.
          </p>
        </div>

        <h2 className="text-lg font-semibold text-slate-900">Original 6 concepts (for reference)</h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {CONCEPTS.map(({ Icon, name, concept, whyItWorks, weakness, faviconNote, recommended }) => (
            <div
              key={name}
              className={`rounded-2xl border bg-white p-5 shadow-sm ${recommended ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-200'}`}
            >
              <div className="flex items-center gap-4">
                <Icon size={56} />
                <div className="flex flex-col gap-1.5">
                  {/* Small preview to sanity-check the exact detail level a nav bar / favicon would actually render at, alongside the large preview above. */}
                  <div className="flex items-center gap-2">
                    <Icon size={24} />
                    <Icon size={16} />
                  </div>
                  {recommended && (
                    <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      Recommended
                    </span>
                  )}
                </div>
              </div>

              <h2 className="mt-4 text-base font-semibold text-slate-900">{name}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{concept}</p>

              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Why it works</dt>
                  <dd className="mt-1 leading-relaxed text-slate-600">{whyItWorks}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-amber-700">Possible weakness</dt>
                  <dd className="mt-1 leading-relaxed text-slate-600">{weakness}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Favicon suitability</dt>
                  <dd className="mt-1 leading-relaxed text-slate-600">{faviconNote}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">Original recommendation (superseded)</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            This page originally recommended <strong>Concept 1 (Terminal / 5250 screen + AI spark)</strong> as the
            strongest fit against the initial brief. The Product Owner reviewed the full set and preferred{' '}
            <strong>Concept 2 (the &ldquo;i&rdquo; monogram)</strong> instead, for being cleaner, more modern, more
            brandable, and working better at small sizes than the more detailed terminal/chip options -- kept here
            for context, not as an active recommendation.
          </p>
        </div>

        <div className="pt-4">
          <h2 className="text-lg font-semibold text-slate-900">Refined Concept 2 variants</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Four practical variants of the selected direction, including an exploration of the Product Owner's
            question below about whether the icon can also contain &ldquo;iRPG&rdquo; text.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {REFINED_VARIANTS.map(({ Icon, name, description, worksBestFor, faviconSuitable, navSuitable, marketingOnly, recommended }) => (
            <div
              key={name}
              className={`rounded-2xl border bg-white p-5 shadow-sm ${recommended ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-200'}`}
            >
              <div className="flex items-center gap-4">
                <Icon size={56} />
                <div className="flex flex-col gap-1.5">
                  {/* Nav-size and favicon-size previews, same reasoning as the original concept grid above. */}
                  <div className="flex items-center gap-2">
                    <Icon size={24} />
                    <Icon size={16} />
                  </div>
                  {recommended && (
                    <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      Recommended
                    </span>
                  )}
                </div>
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">{name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>

              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Works best for</dt>
                  <dd className="mt-1 leading-relaxed text-slate-600">{worksBestFor}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Favicon-suitable?</dt>
                  <dd className="mt-1 leading-relaxed text-slate-600">{faviconSuitable}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">Header/nav-suitable?</dt>
                  <dd className="mt-1 leading-relaxed text-slate-600">{navSuitable}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-amber-700">Marketing/large-size only?</dt>
                  <dd className="mt-1 leading-relaxed text-slate-600">{marketingOnly}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
          <h2 className="text-sm font-semibold text-blue-900">Recommendation</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            <strong>Variant A (the primary refined icon)</strong> should be the final nav/favicon mark -- it's the
            cleanest, simplest execution of the Product Owner's selected direction, and reads clearly at every
            size tested. Variant B is a reasonable alternative if a slightly stronger "this is a terminal/IBM i
            tool" cue is wanted without changing the overall silhouette; Variant D is the fallback specifically for
            the literal favicon file if Variant A's spark ever looks soft in a real rendered 16px test.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            <strong>On the &ldquo;iRPG&rdquo; text question: keep it out of the primary icon.</strong> At nav/favicon
            size there isn't room for three extra letters without either shrinking the monogram+spark past the
            point of legibility or cramming the letters small enough that they blur -- neither serves the "clean,
            simple, favicon-safe" goal the Product Owner set as the reason for preferring Concept 2 in the first
            place. Variant C shows that "iRPG" works well as its own, separate, larger-format badge (a genuinely
            useful additional asset for social/marketing use) -- but it should stay a secondary asset alongside the
            primary icon, not replace it or get squeezed into it.
          </p>
        </div>
      </div>
    </div>
  )
}
