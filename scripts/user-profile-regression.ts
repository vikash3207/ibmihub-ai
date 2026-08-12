/**
 * Basic User Profile & Header Avatar regression pass.
 *
 * Two kinds of check live here:
 *
 *   1. EXECUTED -- lib/profile.ts's normalisation, validation, avatar-initial
 *      and display-name functions are pure, so they are imported and run
 *      against real inputs, including every case in the required fallback
 *      chain (first name -> full name -> email).
 *
 *   2. SOURCE -- the migration's grants/RLS/idempotency, and the security
 *      properties of the Server Action and the profile page (never trusts a
 *      client-supplied id, never reads email from the form, no service-role
 *      key, redirects when signed out) are asserted against source text,
 *      since none of that can be exercised without a live database and a
 *      real request.
 *
 * Usage:
 *   npm run test:user-profile
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import {
  MAX_CONTACT_LENGTH,
  MAX_NAME_LENGTH,
  avatarInitial,
  buildProfileUpsertPayload,
  displayName,
  isValidContactNumber,
  isValidName,
  normalizeContactNumber,
  normalizeName,
} from '../lib/profile'

let failures = 0
let passed = 0

function check(description: string, condition: boolean, detail?: string) {
  if (condition) {
    passed += 1
    console.log(`  OK    ${description}`)
  } else {
    failures += 1
    console.error(`  FAIL  ${description}${detail ? ` -- ${detail}` : ''}`)
  }
}

function section(title: string) {
  console.log(`\n${title}`)
}

const read = (...parts: string[]) => readFileSync(join(process.cwd(), ...parts), 'utf8')

const migration = read('supabase', 'migrations', '010_user_profile_identity.sql')
const backfillMigration = read('supabase', 'migrations', '011_backfill_missing_user_profiles.sql')
const profileLib = read('lib', 'profile.ts')
const profileAction = read('lib', 'actions', 'profile.ts')
const profilePage = read('app', '(authenticated)', 'profile', 'page.tsx')
const profileForm = read('components', 'profile-form.tsx')
const userMenu = read('components', 'user-menu.tsx')
const siteHeader = read('components', 'site-header.tsx')

function formWith(value: string | undefined): FormDataEntryValue | null {
  return value === undefined ? null : value
}

// ---------------------------------------------------------------------------
section('Name normalisation and validation (executed)')
// ---------------------------------------------------------------------------

check('a real name normalises unchanged', normalizeName(formWith('Grace')) === 'Grace')
check('surrounding whitespace is trimmed', normalizeName(formWith('  Grace  ')) === 'Grace')
check('an empty string normalises to null, not ""', normalizeName(formWith('')) === null)
check('whitespace-only normalises to null', normalizeName(formWith('   ')) === null)
check('a missing field normalises to null', normalizeName(null) === null)
check('a non-string value normalises to null', normalizeName(formWith(undefined)) === null)

check('null is a valid name (nothing supplied)', isValidName(null))
check('an ordinary name is valid', isValidName('Grace Hopper'))
check("an apostrophe is valid (O'Brien)", isValidName("O'Brien"))
check('a hyphenated name is valid', isValidName('Anne-Marie'))
check(`a name at exactly ${MAX_NAME_LENGTH} characters is valid`, isValidName('a'.repeat(MAX_NAME_LENGTH)))
check(`a name over ${MAX_NAME_LENGTH} characters is rejected`, !isValidName('a'.repeat(MAX_NAME_LENGTH + 1)))
check('a name with an embedded newline is rejected', !isValidName('Grace\nHopper'))
check('a name with a NUL byte is rejected', !isValidName('Grace' + String.fromCharCode(0) + 'Hopper'))

// ---------------------------------------------------------------------------
section('Contact number normalisation and validation (executed)')
// ---------------------------------------------------------------------------

check('a plain number normalises unchanged', normalizeContactNumber(formWith('5551234567')) === '5551234567')
check('an empty contact number normalises to null', normalizeContactNumber(formWith('')) === null)
check('a missing contact number normalises to null', normalizeContactNumber(null) === null)

check('null is a valid contact number (optional field, nothing supplied)', isValidContactNumber(null))
check('a plain digit string is valid', isValidContactNumber('5551234567'))
check('digits with a leading + are valid', isValidContactNumber('+15551234567'))
check('digits with spaces, hyphens and parens are valid', isValidContactNumber('+1 (555) 123-4567'))
check(`a value at exactly ${MAX_CONTACT_LENGTH} characters is valid`, isValidContactNumber('1'.repeat(MAX_CONTACT_LENGTH)))
check(`a value over ${MAX_CONTACT_LENGTH} characters is rejected`, !isValidContactNumber('1'.repeat(MAX_CONTACT_LENGTH + 1)))
check('letters are rejected', !isValidContactNumber('call-me-maybe'))
check('a value with an embedded newline is rejected', !isValidContactNumber('555\n1234'))
check(
  'this is deliberately not real phone-number validation (no country-code awareness)',
  isValidContactNumber('000000000000000000000000') // 24 digits, nonsense, but format-valid on purpose
)

// ---------------------------------------------------------------------------
section('Avatar initial -- the required fallback chain (executed)')
// ---------------------------------------------------------------------------

check(
  'first name present: uses its first letter',
  avatarInitial({ firstName: 'Grace', lastName: 'Hopper', email: 'grace@example.com' }) === 'G'
)
check(
  'first name is lowercase: still uppercased',
  avatarInitial({ firstName: 'grace', lastName: null, email: 'grace@example.com' }) === 'G'
)
check(
  'no first name, but a last name: falls back to the full name (which is just the last name here)',
  avatarInitial({ firstName: null, lastName: 'Hopper', email: 'grace@example.com' }) === 'H'
)
check(
  'no name at all: falls back to the email',
  avatarInitial({ firstName: null, lastName: null, email: 'grace@example.com' }) === 'G'
)
check(
  'no name and a mixed-case email: still uppercased',
  avatarInitial({ firstName: null, lastName: null, email: 'zed@example.com' }) === 'Z'
)
check(
  'a whitespace-only first name is treated as absent, not as a literal space',
  avatarInitial({ firstName: '   ', lastName: null, email: 'grace@example.com' }) === 'G'
)
check(
  'first name wins even when a last name is also present',
  avatarInitial({ firstName: 'Grace', lastName: 'Hopper', email: 'zed@example.com' }) === 'G'
)

// ---------------------------------------------------------------------------
section('Display name (executed)')
// ---------------------------------------------------------------------------

check('both names present joins them', displayName({ firstName: 'Grace', lastName: 'Hopper' }) === 'Grace Hopper')
check('only a first name', displayName({ firstName: 'Grace', lastName: null }) === 'Grace')
check('only a last name', displayName({ firstName: null, lastName: 'Hopper' }) === 'Hopper')
check('neither name is null, not an empty string', displayName({ firstName: null, lastName: null }) === null)
check(
  'whitespace-only names count as neither being set',
  displayName({ firstName: '   ', lastName: '  ' }) === null
)

// ---------------------------------------------------------------------------
section('Profile upsert payload shape (executed -- Hotfix: Profile Save Server Error)')
// ---------------------------------------------------------------------------

{
  const payload = buildProfileUpsertPayload('user-abc-123', 'Grace', 'Hopper', '5551234567')
  check('id is exactly the userId argument passed in', payload.id === 'user-abc-123')
  check('first_name maps through unchanged', payload.first_name === 'Grace')
  check('last_name maps through unchanged', payload.last_name === 'Hopper')
  check('contact_number maps through unchanged', payload.contact_number === '5551234567')
  check('the payload has exactly the four columns migration 010 added/uses -- nothing wider', Object.keys(payload).sort().join(',') === 'contact_number,first_name,id,last_name')
}

{
  // The one invariant that matters most: no matter what a caller passes as
  // the name/contact fields, `id` only ever reflects the `userId` argument --
  // there is no code path here that could let a client-controlled value
  // reach the `id` column this upserts into.
  const attackerSuppliedId = 'not-my-real-user-id'
  const payload = buildProfileUpsertPayload('real-session-user-id', attackerSuppliedId, null, null)
  check(
    "a value that happens to look like an id, passed as firstName, never leaks into the id field",
    payload.id === 'real-session-user-id' && payload.first_name === attackerSuppliedId
  )
}

{
  const missingRowPayload = buildProfileUpsertPayload('user-no-row-yet', null, null, null)
  check('an all-null payload (new/never-touched row) still carries a real id', missingRowPayload.id === 'user-no-row-yet')
  check('null fields stay null, not coerced to empty strings', missingRowPayload.first_name === null && missingRowPayload.contact_number === null)
}

// ---------------------------------------------------------------------------
section('Server Action security (source)')
// ---------------------------------------------------------------------------

check("the action module is server-only ('use server')", /^'use server'/m.test(profileAction))
check('user comes from a real getUser() call', /user = \(await supabase\.auth\.getUser\(\)\)\.data\.user/.test(profileAction))
check(
  'a session that completes normally with no user still returns the specific "log in again" message, unchanged',
  /if \(!user\) \{[\s\S]{0,120}Your session has expired/.test(profileAction)
)
check('there is no id field read from the submitted form', !/formData\.get\(['"]id['"]\)/.test(profileAction))
check('there is no email field read from the submitted form', !/formData\.get\(['"]email['"]\)/.test(profileAction))
check('no service-role key is used', !/SERVICE_ROLE|service_role|createAdminClient/.test(profileAction))
check('names are validated before being written', profileAction.indexOf('isValidName') < profileAction.indexOf(".from('user_profiles')"))
check(
  'the contact number is validated before being written',
  profileAction.indexOf('isValidContactNumber') < profileAction.indexOf(".from('user_profiles')")
)
check('the header is refreshed after a successful save', /revalidatePath\('\/', 'layout'\)/.test(profileAction))

// ---------------------------------------------------------------------------
section('Hotfix: "use server" export violation -- the confirmed production crash (source)')
// ---------------------------------------------------------------------------

// CONFIRMED root cause (Vercel error: `A "use server" file can only export
// async functions, found object.`): lib/actions/profile.ts used to also
// export UpdateProfileState (a type) and UPDATE_PROFILE_INITIAL_STATE (a
// plain object) alongside updateProfile(). Next.js rejects a 'use server'
// module at evaluation time the moment it sees a non-async-function export,
// which happens before updateProfile() ever runs -- Supabase was never
// contacted, and nothing inside the function's try/catch could have caught
// it. These checks assert the module now exports exactly one thing: the
// async Server Action itself.
{
  const exportLines = profileAction.match(/^export .+$/gm) ?? []
  check('the module has exactly one top-level export', exportLines.length === 1, `found ${exportLines.length}: ${exportLines.join(' | ')}`)
  check(
    'that sole export is the async updateProfile Server Action',
    exportLines[0]?.startsWith('export async function updateProfile') ?? false,
    exportLines[0]
  )
}
check('there is no exported runtime object, constant, or class anywhere in the file', !/^export (const|class) /m.test(profileAction))
check('there is no exported non-async function anywhere in the file', !/^export function /m.test(profileAction))
check('UpdateProfileState is no longer defined/exported from this file', !/export type UpdateProfileState/.test(profileAction))
check('UPDATE_PROFILE_INITIAL_STATE is no longer defined/exported from this file', !/export const UPDATE_PROFILE_INITIAL_STATE/.test(profileAction))
check(
  'UpdateProfileState is instead imported (type-only, erases at runtime) from lib/profile',
  /type UpdateProfileState,?[\s\S]{0,20}\} from '@\/lib\/profile'/.test(profileAction)
)
check('lib/profile.ts is where UpdateProfileState now lives', /export type UpdateProfileState/.test(profileLib))
check('lib/profile.ts is where UPDATE_PROFILE_INITIAL_STATE now lives', /export const UPDATE_PROFILE_INITIAL_STATE/.test(profileLib))
check(
  'the form imports UPDATE_PROFILE_INITIAL_STATE from lib/profile, not the Server Action module',
  /UPDATE_PROFILE_INITIAL_STATE[\s\S]{0,10}\} from '@\/lib\/profile'/.test(profileForm)
)
check(
  'the form does not import UPDATE_PROFILE_INITIAL_STATE from lib/actions/profile',
  !/UPDATE_PROFILE_INITIAL_STATE[\s\S]{0,120}from '@\/lib\/actions\/profile'/.test(profileForm)
)
check("the form still imports updateProfile itself from lib/actions/profile", /import \{ updateProfile \} from '@\/lib\/actions\/profile'/.test(profileForm))

// ---------------------------------------------------------------------------
section('Hotfix: Profile Save Server Error -- logging never leaks raw error detail (source)')
// ---------------------------------------------------------------------------

// These assert the *absence* of specific leak patterns across the whole
// file, not just near one call site -- a prior version of this fix logged
// `caughtError.message` in the upsert's catch block, which these are
// written to genuinely reject (they failed against that version).
check("error.message is never logged", !/console\.[a-z]+\([^;]*\berror\.message\b/.test(profileAction))
check("caughtError.message is never logged", !/console\.[a-z]+\([^;]*\bcaughtError\.message\b/.test(profileAction))
check(
  'a caught exception is never bound to a name and passed to console -- catch blocks take no parameter at all',
  !/catch \([a-zA-Z]+\)/.test(profileAction)
)
check(
  'every console.error call logs only the fixed, non-sensitive label',
  (profileAction.match(/console\.error\(([^)]*)\)/g) ?? []).every((call) => /'unexpected_exception'/.test(call))
)

// ---------------------------------------------------------------------------
section('Hotfix: Profile Save Server Error -- upsert + crash safety (source)')
// ---------------------------------------------------------------------------

// Confirmed: a missing user_profiles row made the OLD plain .update() fail/
// no-op. Separately confirmed: an unhandled thrown exception is what
// crashed the /profile page on Save. NOT confirmed: that the missing row
// directly caused that specific exception (the production exception itself
// was never inspected -- no Vercel log access). upsert() fixes the
// missing-row edge case; try/catch is an independent fix that stops any
// unexpected Supabase exception, whatever its cause, from crashing the page.
check('the write is an upsert, not a plain update (creates the row if missing)', /\.upsert\(/.test(profileAction))
check('there is no remaining plain .update( call on user_profiles', !/\.update\(\{/.test(profileAction))
check('the upsert has an explicit onConflict on the primary key', /\{\s*onConflict:\s*'id'\s*\}/.test(profileAction))
check(
  'the upsert payload is built by the shared, unit-tested helper, not an inline object literal',
  /buildProfileUpsertPayload\(user\.id, firstName, lastName, contactNumber\)/.test(profileAction)
)
check('the row is still requested back to confirm the write actually happened', /\.select\('id'\)\s*\.maybeSingle\(\)/.test(profileAction))
check(
  'createClient() and getUser() are wrapped in try/catch too -- not just the upsert',
  /try \{[\s\S]{0,120}supabase = await createClient\(\)[\s\S]{0,200}getUser\(\)[\s\S]{0,120}\} catch/.test(profileAction)
)
check('the upsert call is wrapped in try/catch so a thrown exception cannot escape the action', /try \{[\s\S]{0,400}\.upsert\([\s\S]{0,600}\} catch/.test(profileAction))
check(
  'a caught exception from createClient()/getUser() returns the generic failure, not a specific/leaky message',
  /catch \{[\s\S]{0,120}logUnexpectedFailure\(\)[\s\S]{0,60}return GENERIC_FAILURE/.test(profileAction)
)
check(
  "an explicit Supabase error on the upsert is tracked as failure independently of whether a row was also returned",
  /hasFailed = Boolean\(error\)/.test(profileAction)
)
check(
  'a caught exception on the upsert also sets the same failure flag (not a separate, weaker path)',
  /catch \{[\s\S]{0,80}hasFailed = true/.test(profileAction)
)
check(
  'failure is either signal, not just a missing row -- data being non-null cannot override an explicit error',
  /if \(hasFailed \|\| !updated\)/.test(profileAction)
)
check(
  'success is returned only after the combined hasFailed/!updated check has passed',
  profileAction.indexOf('if (hasFailed || !updated)') < profileAction.lastIndexOf("status: 'success',")
)

// ---------------------------------------------------------------------------
section('Profile page security (source)')
// ---------------------------------------------------------------------------

check('the page never statically caches', /export const dynamic = 'force-dynamic'/.test(profilePage))
check('the page is excluded from indexing', /robots: \{ index: false, follow: false \}/.test(profilePage))
check('the page checks the real session', /await supabase\.auth\.getUser\(\)/.test(profilePage))
check('a signed-out visitor is redirected, not shown the form', /if \(!user\)[\s\S]{0,80}redirect\(/.test(profilePage))
check(
  'the redirect happens before the profile row is ever queried',
  profilePage.indexOf('redirect(') < profilePage.indexOf(".from('user_profiles')")
)
check('the profile row is scoped to the verified session user', /\.eq\('id', user\.id\)/.test(profilePage))
check('no service-role key is used', !/SERVICE_ROLE|service_role/.test(profilePage))
check('the displayed email comes from the verified Supabase user, not a stored/editable field', /email=\{user\.email/.test(profilePage))

// ---------------------------------------------------------------------------
section('Profile form (source)')
// ---------------------------------------------------------------------------

check('there is no input named email anywhere in the form', !/name="email"/.test(profileForm))
check('email is rendered as static text, not editable', !/<input[^>]*email/i.test(profileForm))
check('first and last name are capped at the shared length limit', profileForm.includes('maxLength={MAX_NAME_LENGTH}'))
check('the contact number is capped at the shared length limit', profileForm.includes('maxLength={MAX_CONTACT_LENGTH}'))
check('the save control is the pending-aware button (prevents double submission)', /<SubmitButton/.test(profileForm))
check('a submitted password is never part of this form', !/type="password"/.test(profileForm))
check('success is rendered from returned action state, not a query parameter', /state\.status === 'success'/.test(profileForm))
check('failure is rendered from returned action state, not a query parameter', /state\.status === 'error'/.test(profileForm))
check('the form reads no searchParams at all', !/searchParams/.test(profileForm))

// ---------------------------------------------------------------------------
section('Header avatar wiring (source)')
// ---------------------------------------------------------------------------

check('the header still performs exactly one session check', (siteHeader.match(/auth\.getUser\(\)/g) ?? []).length === 1)
check('the profile lookup only runs for an authenticated visitor', /user\s*\?\s*await supabase\.from\('user_profiles'\)/.test(siteHeader))
check('the profile lookup is scoped to the signed-in user', /\.eq\('id', user\.id\)/.test(siteHeader))
check('the existing standalone Log out control is still present', siteHeader.includes('Log out'))
check('the avatar/dropdown is added, not swapped in for the existing control', siteHeader.includes('<UserMenu'))
check(
  'the broadcaster this header already relies on is untouched',
  siteHeader.includes('<AuthStateBroadcaster isAuthenticated={Boolean(user)} />')
)

// UserMenu itself.
check('the trigger is a real <button>, keyboard-focusable by default', /<button[\s\S]{0,200}aria-expanded/.test(userMenu))
check('the trigger announces itself as an account menu', /aria-label=\{name/.test(userMenu))
check('the trigger reports open/closed state to assistive tech', /aria-expanded=\{isOpen\}/.test(userMenu))
check('the trigger points at the panel it controls', /aria-controls=\{panelId\}/.test(userMenu))
// aria-haspopup="true" is reserved for exactly the menu/menuitem contract
// this deliberately isn't -- asserting its absence is what catches the
// contradiction a reviewer found between the doc comment and the markup.
// Matches the JSX attribute, not its mention (with an explanatory "previously")
// in the design-choice doc comment above.
check(
  'the trigger does not claim menu/popup semantics it does not implement',
  !/<button[^>]*aria-haspopup/.test(userMenu)
)
// A label on a <div> with no role is not exposed to the accessibility tree
// in any meaningful way, so the panel should carry neither.
check('the panel has no role', !/<div\s+id=\{panelId\}[\s\S]{0,80}role=/.test(userMenu))
check('the panel has no aria-label (nothing would announce it)', !/<div\s+id=\{panelId\}[\s\S]{0,80}aria-label/.test(userMenu))
check(
  'the Logout submit button has no onClick that could unmount it mid-submit',
  !/formAction=\{logout\}[\s\S]{0,200}onClick/.test(userMenu)
)
check('Escape closes the panel', /event\.key === 'Escape'/.test(userMenu))
check('Escape returns focus to the trigger, not leaving it stranded', /triggerRef\.current\?\.focus\(\)/.test(userMenu))
check('a click outside the panel closes it', /containerRef\.current[\s\S]{0,40}\.contains\(event\.target/.test(userMenu))
check(
  'outside-close is bound via pointerdown, which covers mouse, touch and pen',
  userMenu.includes("addEventListener('pointerdown'")
)
check('the listeners are removed on unmount/close (no leaked global listeners)', /return \(\) => \{[\s\S]{0,200}removeEventListener/.test(userMenu))
check('the dropdown offers a My Profile link', userMenu.includes('My Profile'))
check('the dropdown offers a Logout action', userMenu.includes('Logout'))
check('the dropdown Logout calls the same logout() Server Action as the standalone control', /formAction=\{logout\}/.test(userMenu))
// Matches the attribute as it would appear on a JSX element, not the
// backtick-quoted mentions of it in the design-choice doc comment above.
check(
  'the panel is not built as a strict ARIA menu widget without arrow-key support',
  !/<\w+[^>]*\brole="menu"/.test(userMenu)
)

// ---------------------------------------------------------------------------
section('Migration (source -- cannot be exercised without a live database)')
// ---------------------------------------------------------------------------

check('migrations 001-009 are not edited or replaced by this file', !/create table if not exists public\.user_profiles/.test(migration))
check('the three new columns are added, not a new table', /alter table public\.user_profiles/.test(migration))
check('first_name is added idempotently', /add column if not exists first_name\s+text null/.test(migration))
check('last_name is added idempotently', /add column if not exists last_name\s+text null/.test(migration))
check('contact_number is added idempotently', /add column if not exists contact_number\s+text null/.test(migration))
check('all three columns are nullable, matching onboarding_response\'s style', !/not null/.test(migration.match(/add column[\s\S]*?;/)?.[0] ?? ''))
check('length constraints are dropped before being (re)created (idempotent)', /drop constraint if exists user_profiles_first_name_length/.test(migration))
check(
  'the first-name length constraint matches the app-level limit',
  new RegExp(`char_length\\(first_name\\) <= ${MAX_NAME_LENGTH}`).test(migration)
)
check(
  'the contact-number length constraint matches the app-level limit',
  new RegExp(`char_length\\(contact_number\\) <= ${MAX_CONTACT_LENGTH}`).test(migration)
)
check('no new grant is issued (the existing table-level grant already covers new columns)', !/^grant /m.test(migration))
check('no RLS policy is created, dropped, or altered by this migration', !/create policy|drop policy|alter policy/.test(migration))
check('this migration does not touch any other table', !/user_achievements|lessons|lesson_completions/.test(migration))
check('a verification checklist is included, matching house style', migration.includes('VERIFICATION'))
check(
  'the ownership/RLS test is explicitly NOT assigned to the SQL Editor',
  /never the SQL Editor/.test(migration)
)
check(
  'the ownership test explicitly requires an authenticated app/API session',
  /authenticated application\/API\s*\n-- session/.test(migration) || /authenticated application\/API/.test(migration)
)
check('the service-role key is explicitly ruled out for the ownership test', /never with the service-role key/.test(migration))
check(
  'the SQL Editor is explained as having no JWT/session context (why it cannot test RLS)',
  /no\s*\n?-- JWT\/session context/.test(migration) && /there is NULL/.test(migration)
)

// ---------------------------------------------------------------------------
section('Backfill migration 011 (source -- cannot be exercised without a live database)')
// ---------------------------------------------------------------------------

check('migrations 001-010 are not edited or replaced by this file', !/add column if not exists first_name/.test(backfillMigration))
check('this is a data backfill, not a schema change (no alter table)', !/alter table/.test(backfillMigration))
check('no new table, column, grant, or policy is introduced', !/create table|add column|^grant |create policy/m.test(backfillMigration))
check('the insert only targets rows with no matching user_profiles row', /left join public\.user_profiles p on p\.id = u\.id[\s\S]{0,20}where p\.id is null/.test(backfillMigration))
check('the insert is idempotent (on conflict do nothing)', /on conflict \(id\) do nothing/.test(backfillMigration))
check('the insert only ever writes the id column -- no name/contact data is fabricated', /insert into public\.user_profiles \(id\)/.test(backfillMigration))
check('no service-role key is required to run this (plain SQL, no app-side execution)', !/SERVICE_ROLE|service_role_key|createAdminClient/.test(backfillMigration))
check('a verification query is included, matching house style', /VERIFICATION/.test(backfillMigration))

console.log(`\n${passed} passed, ${failures} failed`)
process.exit(failures > 0 ? 1 : 0)
