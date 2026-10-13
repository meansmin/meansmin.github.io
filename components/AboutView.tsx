import Link from 'next/link'
import type { Lang } from '@/lib/types'
import { getPublishedApps } from '@/lib/apps'
import { getHistory } from '@/lib/history'
import { SITE, t, langHref } from '@/lib/i18n'
import Header from './Header'
import Footer from './Footer'
import Reveal from './Reveal'

/** "2026-07" → "2026.07" */
function fmt(date: string) {
  return date.replace('-', '.')
}

export default function AboutView({ lang }: { lang: Lang }) {
  const history = getHistory()
  const last = history.length - 1
  return (
    <>
      <Header lang={lang} here="/about" />
      <main>
        {/* ── 소개 ───────────────────────────────────────────── */}
        <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-16 sm:py-20">
          <div className="wrap max-w-3xl">
            <p className="eyebrow">ABOUT</p>
            <h1 className="mt-3 text-[2.1rem] font-bold tracking-[-0.03em] sm:text-[2.7rem]">
              {t('aboutTitle', lang)}
            </h1>
            <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed text-[var(--color-ink-2)]">
              <p>{t('aboutIntro1', lang)}</p>
              <p>{t('aboutIntro2', lang)}</p>
              <p>{t('aboutIntro3', lang)}</p>
            </div>
          </div>
        </section>

        {/* ── 연혁 ───────────────────────────────────────────── */}
        <section className="py-16 sm:py-20">
          <div className="wrap max-w-3xl">
            <Reveal>
              <p className="eyebrow">HISTORY</p>
              <h2 className="h2">{t('historyTitle', lang)}</h2>
            </Reveal>
            <ol className="hist mt-10">
              {history.map((h, i) => (
                <li key={`${h.date}-${h.slug ?? i}`} className={`hist-item${i === 0 || i === last ? ' hist-key' : ''}`}>
                  <Reveal delay={Math.min(i, 8) * 70}>
                    <div className="hist-row">
                      <span className="hist-dot" aria-hidden />
                      <time className="hist-date" dateTime={h.date}>
                        {fmt(h.date)}
                      </time>
                      <p className="hist-text">
                        {h.slug ? (
                          <Link href={langHref(lang, `/apps/${h.slug}`)} className="hist-link">
                            {h.text[lang]}
                          </Link>
                        ) : (
                          h.text[lang]
                        )}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── 연락 ───────────────────────────────────────────── */}
        <section className="pb-4">
          <div className="wrap max-w-3xl">
            <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-8 text-center">
              <p className="text-[var(--color-ink-2)]">{t('aboutContact', lang)}</p>
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
