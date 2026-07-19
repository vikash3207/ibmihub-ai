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
} from '@/components/brand/logo-concepts'
import { SITE_NAME } from '@/lib/config'

// Temporary internal review page (PR #165) -- not linked from any nav, and
// deliberately excluded from search indexing since it's a design review
// artifact, not real product content. Safe to delete once the Product
// Owner picks a direction (or decides to keep the current mark).
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
            Six alternative icon/logo directions for {SITE_NAME}, for internal Product Owner review only. This
            page is not linked from the site and is excluded from search indexing (<code>robots: noindex</code>).
            None of these have replaced the production mark -- the current header icon and favicon are unchanged.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Every concept reuses only the existing brand colors (blue <code>#2563eb</code>, cyan{' '}
            <code>#22d3ee</code>, white) and is drawn as plain inline SVG -- no image assets, no new dependency,
            and no IBM logo/trademark styling anywhere in this set.
          </p>
        </div>

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

        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
          <h2 className="text-sm font-semibold text-blue-900">Recommendation</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            <strong>Concept 1 (Terminal / 5250 screen + AI spark)</strong> is the strongest overall fit: it pairs
            the clearest "command-line / IBM i" cue in the set with the clearest "AI assistance" cue, using only
            two bold shapes that hold up cleanly at favicon size -- the two properties the design brief weighted
            most heavily. Concept 2 (the refined monogram) is the safest, lowest-change alternative if the Product
            Owner prefers to stay closer to the existing mark rather than adopt a new silhouette.
          </p>
        </div>
      </div>
    </div>
  )
}
