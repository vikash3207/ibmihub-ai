import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  // `./lib` must be included here: static Tailwind class-string bundles that
  // live only in lib/ modules (lib/section-theme.ts, lib/nav-links.ts,
  // lib/deep-dive-categories.ts) are otherwise invisible to Tailwind's JIT
  // scanner -- any class from those bundles that doesn't *also* happen to
  // appear verbatim in a scanned ./app or ./components file is silently
  // never generated. This broke the Deep Dives hero badge (near-invisible
  // text) and the "Non-linear" pillar card (missing background/border/
  // icon-chip color entirely) in production preview -- confirmed by
  // screenshot, not just theory. See scripts/tailwind-content-regression.ts,
  // which fails if this glob is ever removed.
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
}

export default config
