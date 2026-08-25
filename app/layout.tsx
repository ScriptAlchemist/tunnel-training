import type { Metadata } from 'next'
import { Manrope, Nunito_Sans } from 'next/font/google'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
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

export const metadata: Metadata = {
  metadataBase: new URL('https://scriptalchemist.github.io/tunnel-training/'),
  title: {
    default: 'Tunnel Training',
    template: '%s · Tunnel Training',
  },
  description: 'A progressive tunnel flying curriculum by Justin Bender.',
  openGraph: {
    title: 'Tunnel Training',
    description: 'Build control, awareness, and range in the wind tunnel.',
    type: 'website',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
