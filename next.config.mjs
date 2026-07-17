/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Next.js 16 enables Turbopack by default. Adding an empty turbopack config
  // silences the "webpack config present but no turbopack config" build error.
  // Our webpack config below applies only to webpack builds (e.g. when
  // --webpack is passed explicitly, or during legacy CI/tool chains).
  turbopack: {},

  // The lesson detail route, and the AI Tutor API route (lib/ai/lesson-context.ts
  // and lib/ai/retrieve-lessons.ts, both via lib/lessons.ts's loadLessonMarkdown),
  // read Markdown files from content/lessons at request time. The file path
  // isn't a static import, so the bundler can't discover it through static
  // analysis; this tells the file tracer explicitly which files those routes
  // need, instead of it falling back to tracing the whole project.
  outputFileTracingIncludes: {
    '/learn/ibm-i-fundamentals/[slug]': ['./content/lessons/*.md'],
    '/api/ai-tutor': ['./content/lessons/*.md'],
    // The Deep Dive detail route (lib/deep-dive-content.ts's
    // loadDeepDiveMarkdown) reads content/deep-dives/*.md at request time
    // the same way the lesson route reads content/lessons/*.md above.
    '/deep-dives/[slug]': ['./content/deep-dives/*.md'],
  },

  webpack(config) {
    // Suppress the false-positive Edge Runtime warning from @supabase/supabase-js.
    // The import chain lib/supabase/middleware.ts -> @supabase/ssr ->
    // @supabase/supabase-js causes webpack's static analysis to warn about
    // process.version (a Node.js API). The code path that calls process.version
    // is for environment detection only and is never reached in the Edge Runtime.
    // Reference: https://github.com/supabase/supabase-js/issues/1007
    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      {
        module: /node_modules\/@supabase\/supabase-js/,
        message: /A Node\.js API is used \(process\.version\)/,
      },
    ]
    return config
  },
}

export default nextConfig
