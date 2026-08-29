import type { Metadata } from 'next'
import { Manrope, Nunito_Sans } from 'next/font/google'
import { BrandBackground } from '@/components/brand-background'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { getSiteContent } from '@/lib/course'
import { createPageMetadata } from '@/lib/seo'
import { ThemeProvider } from './theme-provider'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const nunito = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const site = getSiteContent()
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const homeMetadata = createPageMetadata({
  title: site.title,
  description: site.description,
  socialDescription: site.socialDescription,
  pathname: '/',
})

export const metadata: Metadata = {
  ...homeMetadata,
  metadataBase: new URL(site.siteUrl),
  title: {
    default: site.title,
    template: `%s · ${site.title}`,
  },
  icons: {
    icon: {
      url: `${basePath}/freefall-formation-icon.png`,
      type: 'image/png',
    },
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.language} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${manrope.variable} ${nunito.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: site.title,
              url: site.siteUrl,
              description: site.description,
              inLanguage: site.language,
            }).replace(/</g, '\\u003c'),
          }}
        />
        <ThemeProvider>
          <BrandBackground />
          <div className="relative z-10">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
