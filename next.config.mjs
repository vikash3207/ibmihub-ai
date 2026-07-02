/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack(config) {
    // Suppress a false-positive Edge Runtime warning from @supabase/supabase-js.
    //
    // The import chain lib/supabase/middleware.ts -> @supabase/ssr -> @supabase/supabase-js
    // causes webpack to warn about process.version (a Node.js API) being referenced.
    // This is a static-analysis false positive: the code path that calls process.version
    // is for environment detection only and is never reached inside the middleware's
    // Edge Runtime execution path. The session-refresh middleware works correctly.
    //
    // References:
    //   https://github.com/supabase/supabase-js/issues/1007
    //   https://supabase.com/docs/guides/auth/server-side/nextjs
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
