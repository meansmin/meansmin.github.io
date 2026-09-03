import Link from 'next/link'
import type { Lang } from '@/lib/types'
import { SITE, t, langHref } from '@/lib/i18n'

/** 상단바. `here` 는 언어를 뺀 현재 경로("/", "/apps/slug", "/contact")다. */
export default function Header({ lang, here = '/' }: { lang: Lang; here?: string }) {
  const other: Lang = lang === 'ko' ? 'en' : 'ko'
  const home = langHref(lang, '/')
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-white/85 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Link href={home} className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-brand)] text-[13px] font-bold text-white">
            C
          </span>
          <span className="text-[1.02rem] font-bold tracking-tight">{SITE.brand}</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm sm:gap-2">
          <Link
            href={langHref(lang, '/products')}
            className="rounded-lg px-3 py-2 font-medium text-[var(--color-ink-2)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
          >
            {t('navProducts', lang)}
          </Link>
          <Link
            href={`${home}#about`}
            className="hidden rounded-lg px-3 py-2 font-medium text-[var(--color-ink-2)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)] sm:block"
          >
            {t('navAbout', lang)}
          </Link>
          <Link
            href={langHref(lang, '/contact')}
            className="rounded-lg px-3 py-2 font-medium text-[var(--color-ink-2)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
          >
            {t('navContact', lang)}
          </Link>
          <Link
            href={langHref(other, here)}
            hrefLang={other}
            className="ml-1 rounded-lg border border-[var(--color-line-strong)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs text-[var(--color-ink-2)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
          >
            {t('langSwitch', lang)}
          </Link>
        </nav>
      </div>
    </header>
  )
}
