import type { Lang } from '@/lib/types'
import { getPublishedApps } from '@/lib/apps'
import { SITE, t } from '@/lib/i18n'
import Header from './Header'
import Footer from './Footer'

export default function ContactView({ lang }: { lang: Lang }) {
  return (
    <>
      <Header lang={lang} here="/contact" />
      <main>
        <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-16 sm:py-20">
          <div className="wrap max-w-2xl">
            <p className="eyebrow">CONTACT</p>
            <h1 className="mt-3 text-[2.1rem] font-bold tracking-[-0.03em] sm:text-[2.7rem]">
              {t('contactTitle', lang)}
            </h1>
            <p className="mt-4 text-[1.02rem] text-[var(--color-ink-2)]">{t('contactLead', lang)}</p>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="wrap max-w-2xl">
            <div className="rounded-2xl border border-[var(--color-line)] bg-white p-9 text-center shadow-[0_2px_12px_rgba(21,32,47,0.05)]">
              <p className="text-[var(--color-ink-2)]">{t('fNoForm', lang)}</p>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-4 inline-block rounded-xl bg-[var(--color-brand)] px-7 py-3.5 font-[family-name:var(--font-mono)] text-[0.95rem] font-medium text-white shadow-[0_4px_14px_rgba(43,91,215,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-brand-dark)]"
              >
                {SITE.email}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} apps={getPublishedApps()} />
    </>
  )
}
