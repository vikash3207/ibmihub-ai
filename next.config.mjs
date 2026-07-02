/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Next.js 16 enables Turbopack by default. Adding an empty turbopack config
  // silences the "webpack config present but no turbopack config" build error.
  // Our webpack config below applies only to webpack builds (e.g. when
  // --webpack is passed explicitly, or during legacy CI/tool chains).
  turbopack: {},

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
