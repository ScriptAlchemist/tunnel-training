import { LevelCard } from '@/components/level-card'
import { Button } from '@/components/ui/button'
import { getCourseIntro, getLevels, getSiteContent } from '@/lib/course'

export default function HomePage() {
  const intro = getCourseIntro()
  const levels = getLevels()
  const site = getSiteContent()

  return (
    <>
      <section id="about" className="shell scroll-mt-28 pt-8 pb-8 sm:pt-12 sm:pb-10">
        <div className="panel grid overflow-hidden rounded-[2rem] lg:grid-cols-[0.72fr_1.28fr]">
          <div className="relative min-h-80 overflow-hidden bg-[var(--foreground)] p-8 text-[var(--background)] sm:p-12">
            <div className="absolute -right-16 -bottom-16 size-64 rounded-full border-[3rem] border-[#55b9db]/35" />
            <div className="absolute top-1/3 -left-20 size-52 rounded-full border-[2rem] border-primary/60" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <span className="text-xs font-extrabold tracking-[0.2em] uppercase opacity-65">{intro.quoteLabel}</span>
              <blockquote className="display-type balance text-3xl leading-tight font-black sm:text-4xl">
                “{intro.quote}”
              </blockquote>
            </div>
          </div>
          <div className="p-8 sm:p-12 lg:p-14">
            <span className="eyebrow">{intro.aboutEyebrow}</span>
            <h2 className="display-type balance mt-4 text-3xl font-black sm:text-5xl">{intro.title}</h2>
            <div
              className="lesson-copy mt-7 max-w-3xl text-muted-foreground [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: intro.aboutHtml }}
            />
            <p className="mt-8 text-sm font-extrabold text-primary">— {intro.author}</p>
          </div>
        </div>
      </section>

      <section className="shell py-8 sm:py-10" id="levels">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">{intro.levelsEyebrow}</span>
            <h2 className="display-type balance mt-4 text-4xl font-black sm:text-5xl">{intro.levelsTitle}</h2>
          </div>
          <p className="max-w-md leading-7 text-muted-foreground">
            {intro.levelsDescription}
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {levels.map((level) => (
            <LevelCard key={level.slug} level={level} />
          ))}
        </div>
      </section>

      <section className="shell pt-8 pb-4 sm:pt-10 sm:pb-8">
        <div className="panel flex flex-col gap-7 rounded-[2rem] px-8 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-12">
          <div>
            <span className="eyebrow">{intro.bookingEyebrow}</span>
            <h2 className="display-type mt-3 text-3xl font-black sm:text-4xl">{intro.bookingTitle}</h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-3 inline-block text-sm font-bold text-muted-foreground underline decoration-border underline-offset-4 hover:text-primary"
            >
              {site.email}
            </a>
          </div>
          <Button asChild size="lg" className="h-auto shrink-0 rounded-full px-6 py-3.5 font-extrabold hover:-translate-y-0.5">
            <a href={`mailto:${site.email}?subject=${encodeURIComponent(intro.bookingSubject)}`}>
              {intro.bookingButton}
            </a>
          </Button>
        </div>
      </section>
    </>
  )
}
