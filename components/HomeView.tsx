import Link from 'next/link'
import type { Lang } from '@/lib/types'
import { getPublishedApps, pick } from '@/lib/apps'
import { getUpcoming } from '@/lib/upcoming'
import { t, langHref } from '@/lib/i18n'
import Header from './Header'
import Footer from './Footer'
import ProductList from './ProductList'
import ReleaseRail from './ReleaseRail'
import HeroVideo from './HeroVideo'
import Reveal from './Reveal'

export default function HomeView({ lang }: { lang: Lang }) {
  const apps = getPublishedApps()
  const upcoming = getUpcoming()

  // 숫자는 데이터에서 온다. 문구에 직접 적어 두면 다음 출시 때 반드시 어긋난다.
  const title = t('heroTitle', lang)
    .replace('{shipped}', String(apps.length))
    .replace('{next}', String(upcoming.length))

  const about = [
    { title: t('about1Title', lang), body: t('about1Body', lang) },
    { title: t('about2Title', lang), body: t('about2Body', lang) },
    { title: t('about3Title', lang), body: t('about3Body', lang) },
  ]

  return (
    <>
      <Header lang={lang} here="/" />
      <main>
        {/* ── 히어로 ─────────────────────────────────────────── */}
        <section className="hero">
          <HeroVideo
            poster="/media/hero/hero-poster.jpg"
            webm="/media/hero/hero.webm"
            mp4="/media/hero/hero.mp4"
          />
          <div className="wrap hero-body">
            <p className="eyebrow rise">
              Google Play · {t('heroShipped', lang)} {apps.length} · {t('heroNext', lang)} {upcoming.length}
            </p>
            <h1 className="hero-title rise" style={{ animationDelay: '80ms' }}>
              {title.split('\n').map((line, i) => (
                <span key={i} className="block">
                  {/* 숫자만 디스플레이 서체·브랜드색으로 — 한글 문장 속에서 수치가 튀어 보이게 */}
                  {line.split(/(\d+)/).map((part, j) =>
                    /^\d+$/.test(part) ? (
                      <span key={j} className="num">
                        {part}
                      </span>
                    ) : (
                      part
                    ),
                  )}
                </span>
              ))}
            </h1>
            <p className="hero-lead rise" style={{ animationDelay: '160ms' }}>
              {t('heroBody', lang)}
            </p>
            <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: '240ms' }}>
              <Link href={langHref(lang, '/products')} className="btn-primary">
                {t('ctaProducts', lang)}
              </Link>
              <Link href={`${langHref(lang, '/')}#next`} className="btn-ghost">
                {t('ctaNext', lang)}
              </Link>
            </div>
          </div>

          {/* 시그니처 — 출시 타임라인. 지표 타일 대신 이것이 숫자를 말한다. */}
          <div className="wrap rise" style={{ animationDelay: '360ms' }}>
            <ReleaseRail apps={apps} upcoming={upcoming} lang={lang} />
          </div>
        </section>

        {/* ── 제품 ───────────────────────────────────────────── */}
        <section id="products" className="scroll-mt-20 py-20 sm:py-28">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">{t('productsEyebrow', lang)}</p>
              <h2 className="h2">{t('productsTitle', lang)}</h2>
              <p className="lead">{t('productsBody', lang)}</p>
            </Reveal>
            <ProductList apps={apps} lang={lang} />
          </div>
        </section>

        {/* ── 준비 중 ─────────────────────────────────────────── */}
        {upcoming.length > 0 && (
          <section id="next" className="next scroll-mt-20 py-20 sm:py-28">
            <div className="wrap">
              <Reveal>
                <p className="eyebrow">{t('nextEyebrow', lang)}</p>
                <h2 className="h2">{t('nextTitle', lang)}</h2>
                <p className="lead">{t('nextBody', lang)}</p>
              </Reveal>
              <ul className="mt-10 grid gap-5 sm:grid-cols-3">
                {upcoming.map((u, i) => (
                  <li key={u.slug}>
                    <Reveal delay={i * 90}>
                      <div className="glass next-card">
                      <div className="flex items-center justify-between">
                        <span className="chip">{t(u.kind === 'game' ? 'game' : 'app', lang)}</span>
                        <span className="pulse-dot" aria-hidden />
                      </div>
                      <h3 className="mt-5 text-[1.25rem] font-bold tracking-tight">{pick(u.name, lang)}</h3>
                      <p className="mt-1.5 text-[0.9rem] text-[var(--color-ink-2)]">{pick(u.genre, lang)}</p>
                      <p className="mt-6 font-[family-name:var(--font-display)] text-[0.78rem] tracking-[0.12em] text-[var(--color-brand)] uppercase">
                        {t(`stage_${u.stage}`, lang)}
                      </p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── 회사 소개 ───────────────────────────────────────── */}
        <section id="about" className="scroll-mt-20 border-y border-[var(--color-line)] bg-[var(--color-surface)] py-20 sm:py-28">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">{t('aboutEyebrow', lang)}</p>
              <h2 className="h2">{t('aboutTitle', lang)}</h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {about.map((c, i) => (
                <Reveal key={c.title} delay={i * 90}>
                  <div className="about-card">
                    <h3 className="text-[1.05rem] font-bold tracking-tight">{c.title}</h3>
                    <p className="mt-2.5 text-[0.92rem] leading-relaxed text-[var(--color-ink-2)]">{c.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 문의 유도 ───────────────────────────────────────── */}
        <section className="py-20 sm:py-28">
          <div className="wrap">
            <Reveal>
              <div className="cta-band">
                <h2 className="text-[1.7rem] font-bold tracking-[-0.02em] text-white sm:text-[2.1rem]">
                  {t('ctaBandTitle', lang)}
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-[0.98rem] text-white/85">{t('ctaBandBody', lang)}</p>
                <Link href={langHref(lang, '/contact')} className="btn-on-dark mt-8">
                  {t('ctaContact', lang)}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer lang={lang} apps={apps} />
    </>
  )
}
