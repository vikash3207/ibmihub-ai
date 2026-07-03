# ADR-006: Framework Version Security Update

## Status

Accepted

## Context

ADR-001 selected Next.js 14 as the MVP technology stack. During Sprint 1 Batch 1 security validation, `npm audit` flagged significant vulnerabilities in Next.js 14.x:

- Next.js 14 is no longer supported (End of Life) per the official Next.js support policy.
- `npm audit` reported 8 vulnerabilities including 1 critical and 6 high severity CVEs in Next.js 14.2.x.
- Upgrading within the 14.x patch range (14.2.5 -> 14.2.35) reduced the count but left 5 vulnerabilities (0 critical, 4 high) that could only be resolved by moving to Next.js 15 or 16.
- Next.js 16.x is the current Active LTS; Next.js 15.x is Maintenance LTS.

This is a security and support hygiene change only. It does not change product scope, MVP features, or approved SDD specs.

## Decision Drivers

- npm audit reporting critical and high CVEs in Next.js 14.x with no fix within the 14.x range.
- Next.js 14 is End of Life and will not receive further security patches.
- Production deployments on unsupported frameworks carry unacceptable security risk.
- This project's approved specs (001-009) are not tied to a specific Next.js version.

## Decision

Upgrade to **Next.js 16.2.10** (Active LTS), aligning all related tooling:

| Package | Before | After |
|---|---|---|
| `next` | 14.2.5 | 16.2.10 |
| `eslint-config-next` | 14.2.5 | 16.2.10 |
| `eslint` | 8.x | 9.x (required by eslint-config-next@16) |
| `typescript` | 5.4.5 | 5.6.3 (supported by typescript-eslint@8 which ships with eslint-config-next@16) |

## Consequences

### Breaking Changes Addressed

| Change | Resolution |
|---|---|
| Turbopack is the default bundler in Next.js 16 | Added `turbopack: {}` to `next.config.mjs` to coexist with the webpack fallback |
| ESLint 9 flat config required | Migrated from `.eslintrc.json` to `eslint.config.mjs` using native flat config |
| `middleware.ts` convention deprecated in favor of `proxy.ts` | Renamed `middleware.ts` to `proxy.ts`; auth/session protection is unchanged |
| `next lint` CLI changed in Next.js 16 | Updated lint script from `next lint` to `eslint .` |
| `require()` imports flagged by typescript-eslint@8 | Updated `tailwind.config.ts` to use ESM `import` |

### Security Outcome

| Metric | Before (Next 14.2.5) | After (Next 16.2.10) |
|---|---|---|
| Total vulnerabilities | 8 | 2 |
| Critical | 1 | 0 |
| High | 6 | 0 |
| Moderate | 1 | 2 |
| Production (`--omit=dev`) | 8 | 2 |

The 2 remaining moderate vulnerabilities are PostCSS `<8.5.10` inside Next.js's internal bundle (`node_modules/next/node_modules/postcss`). This is an internal Next.js dependency that cannot be overridden at the application level. It will be resolved when Next.js ships an internal PostCSS update.

### No Product Scope Change

- All 9 approved SDD specs (001-009) remain unchanged.
- No new Batch 2 features were introduced.
- Authentication, content loading, landing page, and middleware behavior are functionally identical.

## Rationale

Next.js 16.x is the only version that resolves the critical and high vulnerabilities in Next.js 14.x while remaining a supported release. The breaking changes were manageable within the existing Batch 1 scope. Staying on an unsupported framework with known critical CVEs would be unacceptable for a production SaaS product.

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-03 | 0.1 | Initial decision record documenting framework upgrade from Next.js 14 to 16 |
