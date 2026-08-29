import Image from 'next/image'
import Link from 'next/link'
import { getSiteContent } from '@/lib/course'
import darkLogo from '@/public/freefall-formation-icon-dark.png'
import lightLogo from '@/public/freefall-formation-icon.png'

export function Logo() {
  const site = getSiteContent()

  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={`${site.title} ${site.labels.home}`}>
      <span className="relative size-12 shrink-0 transition-transform duration-300 group-hover:scale-105">
        <Image
          src={lightLogo}
          alt=""
          aria-hidden="true"
          className="size-full object-contain dark:hidden"
        />
        <Image
          src={darkLogo}
          alt=""
          aria-hidden="true"
          className="hidden size-full object-contain dark:block"
        />
      </span>
      <span className="display-type text-lg font-extrabold tracking-tight">{site.title}</span>
    </Link>
  )
}
