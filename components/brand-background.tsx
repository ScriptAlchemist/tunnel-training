import Image from 'next/image'
import darkMark from '@/public/freefall-formation-icon-dark.png'
import lightMark from '@/public/freefall-formation-icon.png'

export function BrandBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Image
        src={lightMark}
        alt=""
        sizes="(max-width: 768px) 110vw, 68rem"
        className="absolute top-[12vh] -right-[22vw] h-auto w-[min(68rem,110vw)] -rotate-6 select-none opacity-[0.045] dark:hidden"
      />
      <Image
        src={darkMark}
        alt=""
        sizes="(max-width: 768px) 110vw, 68rem"
        className="absolute top-[12vh] -right-[22vw] hidden h-auto w-[min(68rem,110vw)] -rotate-6 select-none opacity-5 dark:block"
      />
    </div>
  )
}
