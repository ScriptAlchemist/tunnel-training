import type { Metadata } from 'next'
import { Manrope, Nunito_Sans } from 'next/font/google'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { getSiteContent } from '@/lib/course'
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

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: site.title,
    template: `%s · ${site.title}`,
  },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.socialDescription,
    type: 'website',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.language} suppressHydrationWarning>
      <body className={`${manrope.variable} ${nunito.variable}`}>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
