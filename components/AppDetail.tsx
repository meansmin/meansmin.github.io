import Link from 'next/link'
import Image from 'next/image'
import type { AppItem, Lang } from '@/lib/types'
import { pick, getPublishedApps } from '@/lib/apps'
import { t, langHref } from '@/lib/i18n'
import { renderMarkdown } from '@/lib/markdown'
import Header from './Header'
import Footer from './Footer'
import StoreButton from './StoreButton'

export default function AppDetail({ app, lang }: { app: AppItem; lang: Lang }) {
  const body = pick(app.body, lang)
  const all = getPublishedApps()
  const others = all.filter((a) => a.slug !== app.slug).slice(0, 3)

  return (
    <>
      <Header lang={lang} here={`/apps/${app.slug}`} />
      <main>
        {/* 제품 헤더 */}
        <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)]">
          <div className="wrap py-10 sm:py-14">
            <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--color-muted)]">
              <Link href={langHref(lang, '/products')} className="transition-colors hover:text-[var(--color-brand)]">
                {t('backHome', lang)}
              </Link>
              <span aria-hidden>/</span>
              <span className="text-[var(--color-ink-2)]">{pick(app.name, lang)}</span>
            </nav>

            <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:gap-9">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[24px] border border-[var(--color-line)] bg-white shadow-[0_4px_18px_rgba(21,32,47,0.08)] sm:h-32 sm:w-32">
                {app.icon && (
                  <Image src={app.icon} alt="" fill sizes="128px" className="object-cover" priority />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center rounded-full bg-[var(--color-brand-soft)] px-3 py-1 text-[0.72rem] font-semibold text-[var(--color-brand)]">
                  {t(app.kind === 'game' ? 'game' : 'app', lang)}
                </span>
                <h1 className="mt-3 text-[2rem] leading-tight font-bold tracking-[-0.03em] sm:text-[2.7rem]">
                  {pick(app.name, lang)}
                </h1>
                <p className="mt-3 max-w-2xl text-[1.02rem] text-[var(--color-ink-2)]">
                  {pick(app.tagline, lang)}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <StoreButton url={app.storeUrl} lang={lang} size="lg" />
                  {app.privacyUrl && (
                    <a
                      href={app.privacyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--color-muted)] underline-offset-4 transition-colors hover:text-[var(--color-brand)] hover:underline"
                    >
                      {t('privacy', lang)}
                    </a>
                  )}
                </div>

                <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-t border-[var(--color-line)] pt-6 text-sm">
                  <div>
                    <dt className="font-[family-name:var(--font-mono)] text-[0.7rem] tracking-wider text-[var(--color-muted)] uppercase">
                      Platform
                    </dt>
                    <dd className="mt-0.5 font-medium">{app.platforms.join(' · ') || '—'}</dd>
                  </div>
                  {app.releaseDate && (
                    <div>
                      <dt className="font-[family-name:var(--font-mono)] text-[0.7rem] tracking-wider text-[var(--color-muted)] uppercase">
                        {t('released', lang)}
                      </dt>
                      <dd className="mt-0.5 font-[family-name:var(--font-mono)] font-medium">
                        {app.releaseDate}
                      </dd>
                    </div>
                  )}
                  {app.tags.length > 0 && (
                    <div>
                      <dt className="font-[family-name:var(--font-mono)] text-[0.7rem] tracking-wider text-[var(--color-muted)] uppercase">
                        Tags
                      </dt>
                      <dd className="mt-0.5 font-medium">{app.tags.join(' · ')}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* 화면 미리보기 */}
        {app.screenshots.length > 0 && (
          <section className="py-14 sm:py-16">
            <div className="wrap mb-6">
              <h2 className="text-[1.3rem] font-bold tracking-tight">{t('screenshots', lang)}</h2>
            </div>
            <div className="wrap flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5">
              {app.screenshots.map((src, i) => (
                /* 앱마다 화면 비율이 달라 고정 비율로 자르면 UI 가 잘린다. 높이만 맞춘다. */
                <Image
                  key={src}
                  src={src}
                  alt={`${pick(app.name, lang)} ${t('screenshots', lang)} ${i + 1}`}
                  width={360}
                  height={720}
                  className="h-[400px] w-auto shrink-0 snap-start rounded-2xl border border-[var(--color-line)] bg-white object-contain shadow-[0_4px_20px_rgba(21,32,47,0.08)] sm:h-[460px]"
                />
              ))}
            </div>
          </section>
        )}

        {/* 제품 소개 */}
        {body && (
          <section className="pb-16">
            <div className="wrap max-w-3xl">
              <h2 className="mb-6 border-b border-[var(--color-line)] pb-4 text-[1.3rem] font-bold tracking-tight">
                {t('about', lang)}
              </h2>
              <div>{renderMarkdown(body)}</div>
              <div className="mt-10">
                <StoreButton url={app.storeUrl} lang={lang} />
              </div>
            </div>
          </section>
        )}

        {/* 다른 제품 */}
        {others.length > 0 && (
          <section className="border-t border-[var(--color-line)] bg-[var(--color-surface)] py-16">
            <div className="wrap">
              <h2 className="mb-7 text-[1.2rem] font-bold tracking-tight">{t('otherProducts', lang)}</h2>
              <ul className="grid gap-4 sm:grid-cols-3">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={langHref(lang, `/apps/${o.slug}`)}
                      className="group flex items-center gap-4 rounded-2xl border border-[var(--color-line)] bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(21,32,47,0.09)]"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[var(--color-line)]">
                        {o.icon && <Image src={o.icon} alt="" fill sizes="48px" className="object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-[0.95rem] font-semibold transition-colors group-hover:text-[var(--color-brand)]">
                          {pick(o.name, lang)}
                        </div>
                        <div className="truncate text-[0.8rem] text-[var(--color-muted)]">
                          {pick(o.tagline, lang)}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer lang={lang} apps={all} />
    </>
  )
}
