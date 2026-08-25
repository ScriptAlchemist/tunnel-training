import Link from 'next/link'
import { LevelCard } from '@/components/level-card'
import { getCourseIntro, getLevels } from '@/lib/course'

export default function HomePage() {
  const intro = getCourseIntro()
  const levels = getLevels()

  return (
    <>
      <section id="about" className="shell scroll-mt-28 pt-8 pb-16 sm:pt-12 sm:pb-24">
        <div className="panel grid overflow-hidden rounded-[2rem] lg:grid-cols-[0.72fr_1.28fr]">
          <div className="relative min-h-80 overflow-hidden bg-[var(--foreground)] p-8 text-[var(--background)] sm:p-12">
            <div className="absolute -right-16 -bottom-16 size-64 rounded-full border-[3rem] border-[#55b9db]/35" />
            <div className="absolute top-1/3 -left-20 size-52 rounded-full border-[2rem] border-[var(--accent)]/60" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <span className="text-xs font-extrabold tracking-[0.2em] uppercase opacity-65">The coaching idea</span>
              <blockquote className="display-type balance text-3xl leading-tight font-black sm:text-4xl">
                “Understand movement well enough to fly in ways you haven’t been taught.”
              </blockquote>
            </div>
          </div>
          <div className="p-8 sm:p-12 lg:p-14">
            <span className="eyebrow">About the curriculum</span>
            <h2 className="display-type balance mt-4 text-3xl font-black sm:text-5xl">{intro.title}</h2>
            <div
              className="lesson-copy mt-7 max-w-3xl text-[var(--muted)] [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: intro.aboutHtml }}
            />
            <p className="mt-8 text-sm font-extrabold text-[var(--accent)]">— {intro.author}</p>
          </div>
        </div>
      </section>

      <section className="shell py-16 sm:py-24" id="levels">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">The flight path</span>
            <h2 className="display-type balance mt-4 text-4xl font-black sm:text-5xl">Learn in layers.</h2>
          </div>
          <p className="max-w-md leading-7 text-[var(--muted)]">
            Start with a dependable neutral position. Add one axis of movement at a time, then connect the skills.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {levels.map((level) => (
            <LevelCard key={level.slug} level={level} />
          ))}
        </div>
      </section>

      <section className="shell py-8 sm:py-14">
        <div className="flex flex-col gap-6 rounded-[2rem] bg-[var(--accent)] px-8 py-10 text-white sm:flex-row sm:items-center sm:justify-between sm:px-12">
          <div>
            <p className="text-xs font-extrabold tracking-[0.18em] uppercase opacity-75">Ready for the next rotation?</p>
            <h2 className="display-type mt-2 text-3xl font-black sm:text-4xl">Choose your starting level.</h2>
          </div>
          <Link href="/levels/" className="shrink-0 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-[#b9371f] transition hover:-translate-y-0.5">
            Explore all lessons →
          </Link>
        </div>
      </section>
    </>
  )
}
