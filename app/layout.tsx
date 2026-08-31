import type { Metadata } from 'next'
import { IBM_Plex_Sans_KR, IBM_Plex_Mono } from 'next/font/google'
import { SITE } from '@/lib/i18n'
import './globals.css'

const plex = IBM_Plex_Sans_KR({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-plex',
  display: 'swap',
})
const plexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),
  title: {
    default: `${SITE.brand} — 모바일 게임과 앱을 만듭니다`,
    template: `%s · ${SITE.brand}`,
  },
  description:
    'C&C F.는 기획부터 아트, 개발, 출시와 운영까지 직접 맡는 팀입니다. 네 개의 앱을 Google Play에서 서비스하고 있습니다.',
  openGraph: {
    type: 'website',
    siteName: SITE.brand,
    title: `${SITE.brand} — 모바일 게임과 앱을 만듭니다`,
    description:
      '기획부터 아트, 개발, 출시와 운영까지. 네 개의 앱을 Google Play에서 서비스하고 있습니다.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${plex.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
