/**
 * Skip-navigation link (Unified Discovery, Accessibility and Responsive
 * Polish) -- visually hidden until it receives keyboard focus (`sr-only
 * focus:not-sr-only`), then renders as the very first focusable element on
 * every page so a keyboard/screen-reader user can jump straight past the
 * header's nav/search/account controls to each page's own <main id="main-content">
 * landmark. No codebase precedent for this existed before -- see the PR's
 * audit findings.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
    >
      Skip to main content
    </a>
  )
}
