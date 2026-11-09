import Link from 'next/link'
import type { AppItem, Lang } from '@/lib/types'
import { pick } from '@/lib/apps'
import { SITE, t, langHref } from '@/lib/i18n'

export default function Footer({ lang, apps = [] }: { lang: Lang; apps?: AppItem[] }) {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-28 border-t border-[var(--color-line)] bg-[var(--color-surface)]">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-[1.2fr_1.5fr_0.7fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-brand)] text-[13px] font-bold text-white">
              C
            </span>
            <span className="text-base font-bold tracking-tight">{SITE.brand}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-[var(--color-muted)]">{t('footerNote', lang)}</p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-4 inline-block font-[family-name:var(--font-mono)] text-sm text-[var(--color-brand)] hover:underline"
          >
            {SITE.email}
          </a>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">{t('footerProducts', lang)}</h3>
          {/* 제품이 늘어도 한 줄로 길어지지 않게 두 칼럼으로 흘린다(위→아래, 그다음 오른쪽 칼럼) */}
          <ul className="columns-2 gap-x-6 text-sm text-[var(--color-muted)] [&>li]:mb-2 [&>li]:break-inside-avoid">
            {apps.map((a) => (
              <li key={a.slug}>
                <Link
                  href={langHref(lang, `/apps/${a.slug}`)}
                  className="transition-colors hover:text-[var(--color-brand)]"
                >
                  {pick(a.name, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">{t('footerCompany', lang)}</h3>
          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            <li>
              <Link href={langHref(lang, '/')} className="transition-colors hover:text-[var(--color-brand)]">
                {t('navProducts', lang)}
              </Link>
            </li>
            <li>
              <Link href={langHref(lang, '/about')} className="transition-colors hover:text-[var(--color-brand)]">
                {t('navAbout', lang)}
              </Link>
            </li>
            <li>
              <Link
                href={langHref(lang, '/contact')}
                className="transition-colors hover:text-[var(--color-brand)]"
              >
                {t('navContact', lang)}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--color-line)]">
        <div className="wrap flex flex-col gap-2 py-5 text-xs text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} {SITE.brand}. All rights reserved.</span>
          <span className="font-[family-name:var(--font-mono)]">Made in Seoul, Korea</span>
        </div>
      </div>
    </footer>
  )
}
