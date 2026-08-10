import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getPublishedLessons } from '@/lib/lessons'
import { getCompletionRecordsForUser } from '@/lib/progress'
import { reconcileAchievementsForUser } from '@/lib/achievements-server'
import { ACHIEVEMENTS, calculateAchievementProgress } from '@/lib/achievements'
import { getTopicById } from '@/lib/topics'
import { formatCompletionDate, parseAcceptLanguage } from '@/lib/format-date'
import { AchievementMedallion, AchievementStatus } from '@/components/achievement-badge'
import { Card } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Personal achievement data -- never statically cached, and never placed in
// a shared cache. Recomputed per request against the trusted session.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Achievements',
  description: 'Your iRPGenie learning achievements.',
  robots: { index: false, follow: false },
}

export default async function AchievementsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?next=%2Fdashboard%2Fachievements')
  }

  // Opening this page is one of the two places lazy backfill runs, so a
  // learner who qualified before this feature shipped is awarded here.
  const [{ achievements }, lessons, completions, requestHeaders] = await Promise.all([
    reconcileAchievementsForUser(user.id),
    getPublishedLessons(),
    getCompletionRecordsForUser(user.id),
    headers(),
  ])

  const locale = parseAcceptLanguage(requestHeaders.get('accept-language'))
  const earnedByCode = new Map(achievements.map((achievement) => [achievement.badgeCode, achievement]))
  const completedLessonIds = new Set(completions.map((completion) => completion.lessonId))
  const earnedCount = ACHIEVEMENTS.filter((definition) => earnedByCode.has(definition.code)).length

  // Registry order throughout (lesson milestones ascending, then topic
  // badges, then the full-curriculum badge). Earned state deliberately does
  // NOT reorder the gallery, so a badge stays where the learner last saw it.
  const nextUp = ACHIEVEMENTS.filter((definition) => !earnedByCode.has(definition.code))[0]

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
          &larr; Dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Achievements</h1>
        <p className="mt-2 text-slate-600 leading-relaxed">
          Milestones for lessons you have marked complete. These are iRPGenie learning achievements
          that track your progress through the curriculum &mdash; they are not certifications or
          formal assessments of skill, and are not affiliated with or endorsed by IBM.
        </p>

        <div className="mt-4 max-w-sm">
          <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
            <span>Badges earned</span>
            <span className="tabular-nums">
              {earnedCount} of {ACHIEVEMENTS.length}
            </span>
          </div>
          <ProgressBar
            percent={ACHIEVEMENTS.length > 0 ? (earnedCount / ACHIEVEMENTS.length) * 100 : 0}
            label={`Achievements earned: ${earnedCount} of ${ACHIEVEMENTS.length}`}
            tone={earnedCount === ACHIEVEMENTS.length ? 'emerald' : 'blue'}
          />
        </div>
      </div>

      {earnedCount === 0 && nextUp && (
        <Card className="border-l-4 border-l-blue-600">
          <h2 className="font-semibold text-slate-900">No badges yet &mdash; your first is close</h2>
          <p className="mt-1 text-sm text-slate-600 leading-relaxed">
            Mark a lesson complete to earn <strong>{nextUp.name}</strong>. {nextUp.condition}.
          </p>
          <Link href="/learn/ibm-i-fundamentals" className={cn(buttonVariants({ variant: 'primary' }), 'mt-4')}>
            Start Learning
          </Link>
        </Card>
      )}

      {earnedCount === ACHIEVEMENTS.length && ACHIEVEMENTS.length > 0 && (
        <Card className="border-l-4 border-l-emerald-500">
          <h2 className="font-semibold text-slate-900">Every badge earned</h2>
          <p className="mt-1 text-sm text-slate-600 leading-relaxed">
            You have earned every achievement currently available. New lessons are published over
            time, so there will be more to work through.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/deep-dives" className={buttonVariants({ variant: 'primary' })}>
              Explore Deep Dives
            </Link>
            <Link href="/practice-lab" className={buttonVariants({ variant: 'secondary' })}>
              Open Practice Lab
            </Link>
            <Link href="/learn/ibm-i-fundamentals" className={buttonVariants({ variant: 'secondary' })}>
              Review the curriculum
            </Link>
          </div>
        </Card>
      )}

      <ul className="grid gap-4 sm:grid-cols-2">
        {ACHIEVEMENTS.map((definition) => {
          const earned = earnedByCode.get(definition.code)
          const isEarned = Boolean(earned)
          const progress = isEarned ? null : calculateAchievementProgress(definition, lessons, completedLessonIds)
          const qualifyingTopicLabel = earned?.qualifyingTopicId
            ? getTopicById(earned.qualifyingTopicId)?.label
            : undefined

          return (
            <li key={definition.code}>
              {/* A plain <article>, not a link: a locked badge has no
                  destination, so nothing here is presented as clickable. */}
              <article
                className={cn(
                  'h-full rounded-2xl border p-4 shadow-sm',
                  isEarned ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50/60'
                )}
              >
                <div className="flex items-start gap-3">
                  <AchievementMedallion definition={definition} earned={isEarned} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className={cn('font-semibold', isEarned ? 'text-slate-900' : 'text-slate-600')}>
                        {definition.name}
                      </h2>
                      <AchievementStatus earned={isEarned} />
                    </div>

                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      {isEarned ? definition.description : definition.condition}
                    </p>

                    {isEarned ? (
                      <div className="mt-2 space-y-0.5 text-xs text-slate-500">
                        <p>
                          Earned{' '}
                          <time dateTime={earned!.earnedAt}>
                            {formatCompletionDate(earned!.earnedAt, locale)}
                          </time>
                        </p>
                        <p>Requirement: {definition.condition}</p>
                        {qualifyingTopicLabel && <p>Qualifying topic: {qualifyingTopicLabel}</p>}
                      </div>
                    ) : (
                      progress && (
                        <div className="mt-2.5">
                          <p className="text-xs text-slate-500 tabular-nums">
                            {progress.progressLabel}
                            {progress.remainingLabel ? ` · ${progress.remainingLabel}` : ''}
                          </p>
                          <ProgressBar
                            percent={progress.target > 0 ? (progress.current / progress.target) * 100 : 0}
                            label={`${definition.name} progress: ${progress.progressLabel}`}
                            className="mt-1.5"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

