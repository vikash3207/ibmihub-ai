// ESLint 9 flat config for Next.js 16.
// Uses native flat config format -- no FlatCompat needed.
// Provides equivalent coverage to 'next/core-web-vitals' + 'next/typescript'.

import tseslint from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  // TypeScript rules
  ...tseslint.configs.recommended,

  // Next.js and React Hooks rules
  {
    plugins: {
      '@next/next': nextPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      // Next.js recommended + core-web-vitals
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // React Hooks rules
      ...reactHooks.configs.recommended.rules,
    },
  },

  // Files to ignore
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**'],
  },
]
