import { FlightFlower } from '@/components/flight-flower'
import { SkillsGraph } from '@/components/skills-graph'
import { Button } from '@/components/ui/button'
import { getCourseIntro, getLevels, getSiteContent } from '@/lib/course'

export default function HomePage() {
  const intro = getCourseIntro()
  const levels = getLevels()
  const site = getSiteContent()

  return (
    <>
      <section className="shell pt-8 pb-8 sm:pt-12 sm:pb-10" id="skills">
        <div className="panel relative overflow-hidden rounded-[2rem] border-primary/15 bg-card p-8 sm:p-12">
          <FlightFlower
            variant="inspin"
            className="absolute -top-20 -right-12 size-64 text-secondary"
          />
          <FlightFlower
            variant="outspin"
            className="absolute -bottom-24 left-[18%] size-52 text-accent"
          />
          <div className="relative z-10 max-w-4xl">
            <span className="text-xs font-extrabold tracking-[0.2em] text-primary uppercase">
              {intro.quoteLabel}
            </span>
            <blockquote className="display-type balance mt-5 text-3xl leading-tight font-black sm:text-5xl">
              “{intro.quote}”
            </blockquote>
            <p className="mt-5 text-sm font-extrabold text-primary">— {intro.author}</p>
          </div>
        </div>

        <div className="mt-10 mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">{intro.levelsEyebrow}</span>
            <h1 className="display-type balance mt-4 text-4xl font-black sm:text-5xl">
              {intro.levelsTitle}
            </h1>
          </div>
          <p className="max-w-md leading-7 text-muted-foreground">
            {intro.levelsDescription}
          </p>
        </div>

        <SkillsGraph levels={levels} />
      </section>

      <section id="about" className="shell scroll-mt-28 py-8 sm:py-10">
        <div className="panel relative isolate overflow-hidden rounded-[2rem] p-8 sm:p-12 lg:p-14">
          <video
            className="about-background-video absolute inset-y-0 right-0 h-full w-full object-cover object-center opacity-45 sm:w-[58%]"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="about-tunnel-poster.jpg"
            aria-hidden="true"
          >
            <source src="about-tunnel.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 bg-gradient-to-r from-card via-card/95 to-card/65 sm:to-card/20"
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-2xl">
            <span className="eyebrow">{intro.aboutEyebrow}</span>
            <h2 className="display-type balance mt-4 text-3xl font-black sm:text-5xl">{intro.title}</h2>
            <div
              className="lesson-copy mt-7 text-muted-foreground [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: intro.aboutHtml }}
            />
            <p className="mt-8 text-sm font-extrabold text-primary">— {intro.author}</p>
          </div>
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
