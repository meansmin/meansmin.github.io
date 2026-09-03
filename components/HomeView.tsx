import Link from 'next/link'
import Image from 'next/image'
import type { Lang } from '@/lib/types'
import { getPublishedApps, pick } from '@/lib/apps'
import { t, langHref } from '@/lib/i18n'
import Header from './Header'
import Footer from './Footer'
import ProductList from './ProductList'

export default function HomeView({ lang }: { lang: Lang }) {
  const apps = getPublishedApps()
  const games = apps.filter((a) => a.kind === 'game').length
  const tools = apps.length - games

  const stats = [
    { label: t('statApps', lang), value: String(apps.length) },
    { label: t('statGames', lang), value: String(games) },
    { label: t('statTools', lang), value: String(tools) },
    { label: t('statPlatform', lang), value: 'Android' },
  ]

  const about = [
    { title: t('about1Title', lang), body: t('about1Body', lang) },
    { title: t('about2Title', lang), body: t('about2Body', lang) },
    { title: t('about3Title', lang), body: t('about3Body', lang) },
  ]

  return (
    <>
      <Header lang={lang} here="/" />
      <main>
        {/* 히어로 */}
        <section className="relative overflow-hidden border-b border-[var(--color-line)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_420px_at_82%_-10%,var(--color-brand-soft),transparent_62%)]"
          />
          <div className="wrap grid items-center gap-14 py-20 sm:py-28 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="eyebrow rise">{t('heroEyebrow', lang)}</p>
              <h1
                className="rise mt-4 text-[2.4rem] leading-[1.18] font-bold tracking-[-0.03em] sm:text-[3.4rem]"
                style={{ animationDelay: '60ms' }}
              >
                {t('heroTitle', lang)}
              </h1>
              <p
                className="rise mt-6 max-w-xl text-[1.02rem] leading-relaxed text-[var(--color-ink-2)]"
                style={{ animationDelay: '120ms' }}
              >
                {t('heroBody', lang)}
              </p>
              <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: '180ms' }}>
                <Link
                  href={langHref(lang, '/products')}
                  className="rounded-xl bg-[var(--color-brand)] px-6 py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_4px_14px_rgba(43,91,215,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-brand-dark)] hover:shadow-[0_8px_22px_rgba(43,91,215,0.32)]"
                >
                  {t('ctaProducts', lang)}
                </Link>
                <Link
                  href={langHref(lang, '/contact')}
                  className="rounded-xl border border-[var(--color-line-strong)] bg-white px-6 py-3.5 text-[0.95rem] font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
                >
                  {t('ctaContact', lang)}
                </Link>
              </div>
            </div>

            {/* 실제 제품 아이콘을 보여주는 것이 회사 소개에서는 가장 정직한 비주얼이다 */}
            <div className="rise grid grid-cols-2 gap-4 sm:gap-5" style={{ animationDelay: '240ms' }}>
              {apps.slice(0, 4).map((a, i) => (
                <Link
                  key={a.slug}
                  href={langHref(lang, `/apps/${a.slug}`)}
                  className="group rounded-2xl border border-[var(--color-line)] bg-white p-4 shadow-[0_2px_10px_rgba(21,32,47,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(21,32,47,0.12)]"
                >
                  <div className="relative mx-auto aspect-square w-full max-w-[104px] overflow-hidden rounded-[20px] border border-[var(--color-line)]">
                    {a.icon && <Image src={a.icon} alt="" fill sizes="120px" className="object-cover" />}
                  </div>
                  <p className="mt-3 truncate text-center text-[0.8rem] font-semibold text-[var(--color-ink-2)] transition-colors group-hover:text-[var(--color-brand)]">
                    {pick(a.name, lang)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 지표 */}
        <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)]">
          <div className="wrap grid grid-cols-2 gap-px py-0 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-1 py-7 text-center sm:py-8">
                <div className="text-[1.5rem] font-bold tracking-tight sm:text-[1.7rem]">{s.value}</div>
                <div className="mt-1 text-[0.8rem] text-[var(--color-muted)]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 제품 */}
        <section id="products" className="scroll-mt-20 py-20 sm:py-24">
          <div className="wrap">
            <p className="eyebrow">{t('productsEyebrow', lang)}</p>
            <h2 className="mt-3 text-[1.9rem] font-bold tracking-[-0.02em] sm:text-[2.4rem]">
              {t('productsTitle', lang)}
            </h2>
            <p className="mt-3 max-w-xl text-[var(--color-ink-2)]">{t('productsBody', lang)}</p>

            <ProductList apps={apps} lang={lang} />
          </div>
        </section>

        {/* 회사 소개 */}
        <section id="about" className="scroll-mt-20 border-y border-[var(--color-line)] bg-[var(--color-surface)] py-20 sm:py-24">
          <div className="wrap">
            <p className="eyebrow">{t('aboutEyebrow', lang)}</p>
            <h2 className="mt-3 text-[1.9rem] font-bold tracking-[-0.02em] sm:text-[2.4rem]">
              {t('aboutTitle', lang)}
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {about.map((c, i) => (
                <div
                  key={c.title}
                  className="rounded-2xl border border-[var(--color-line)] bg-white p-7"
                >
                  <div className="font-[family-name:var(--font-mono)] text-sm font-medium text-[var(--color-brand)]">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="mt-3 text-[1.05rem] font-bold tracking-tight">{c.title}</h3>
                  <p className="mt-2.5 text-[0.92rem] leading-relaxed text-[var(--color-ink-2)]">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 문의 유도 */}
        <section className="py-20 sm:py-24">
          <div className="wrap">
            <div className="rounded-3xl bg-[var(--color-brand)] px-8 py-14 text-center sm:px-14">
              <h2 className="text-[1.7rem] font-bold tracking-[-0.02em] text-white sm:text-[2.1rem]">
                {t('ctaBandTitle', lang)}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-[0.98rem] text-white/80">
                {t('ctaBandBody', lang)}
              </p>
              <Link
                href={langHref(lang, '/contact')}
                className="mt-8 inline-block rounded-xl bg-white px-7 py-3.5 text-[0.95rem] font-semibold text-[var(--color-brand)] transition-transform hover:-translate-y-0.5"
              >
                {t('ctaContact', lang)}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} apps={apps} />
    </>
  )
}
