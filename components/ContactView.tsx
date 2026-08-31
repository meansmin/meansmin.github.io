import type { Lang } from '@/lib/types'
import { getPublishedApps } from '@/lib/apps'
import { SITE, t } from '@/lib/i18n'
import Header from './Header'
import Footer from './Footer'

const field =
  'w-full rounded-xl border border-[var(--color-line-strong)] bg-white px-4 py-3 text-[0.95rem] text-[var(--color-ink)] placeholder:text-[var(--color-muted)] transition-colors focus:border-[var(--color-brand)] focus:outline-none'
const label = 'mb-2 block text-[0.85rem] font-semibold text-[var(--color-ink-2)]'

export default function ContactView({ lang }: { lang: Lang }) {
  const formAction = SITE.formspreeId ? `https://formspree.io/f/${SITE.formspreeId}` : ''
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
            {formAction ? (
              <form action={formAction} method="POST" className="flex flex-col gap-6">
                <input type="hidden" name="_language" value={lang} />
                {/* 스팸 봇용 허니팟 — 사람에게는 보이지 않는다 */}
                <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className={label} htmlFor="name">
                      {t('fName', lang)}
                    </label>
                    <input className={field} id="name" name="name" type="text" required maxLength={80} />
                  </div>
                  <div>
                    <label className={label} htmlFor="email">
                      {t('fEmail', lang)}
                    </label>
                    <input className={field} id="email" name="email" type="email" required maxLength={160} />
                  </div>
                </div>
                <div>
                  <label className={label} htmlFor="subject">
                    {t('fSubject', lang)}
                  </label>
                  <input className={field} id="subject" name="subject" type="text" maxLength={120} />
                </div>
                <div>
                  <label className={label} htmlFor="message">
                    {t('fMessage', lang)}
                  </label>
                  <textarea className={field} id="message" name="message" rows={8} required maxLength={4000} />
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <button
                    type="submit"
                    className="rounded-xl bg-[var(--color-brand)] px-7 py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_4px_14px_rgba(43,91,215,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-brand-dark)]"
                  >
                    {t('fSend', lang)}
                  </button>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-brand)]"
                  >
                    {t('fDirect', lang)} · {SITE.email}
                  </a>
                </div>
              </form>
            ) : (
              <div className="rounded-2xl border border-[var(--color-line)] bg-white p-9 text-center shadow-[0_2px_12px_rgba(21,32,47,0.05)]">
                <p className="text-[var(--color-ink-2)]">{t('fNoForm', lang)}</p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="mt-4 inline-block rounded-xl bg-[var(--color-brand)] px-7 py-3.5 font-[family-name:var(--font-mono)] text-[0.95rem] font-medium text-white shadow-[0_4px_14px_rgba(43,91,215,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-brand-dark)]"
                >
                  {SITE.email}
                </a>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer lang={lang} apps={getPublishedApps()} />
    </>
  )
}
