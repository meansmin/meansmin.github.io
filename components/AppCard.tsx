import Link from 'next/link'
import Image from 'next/image'
import type { AppItem, Lang } from '@/lib/types'
import { pick } from '@/lib/pick'
import { t, langHref } from '@/lib/i18n'

export default function AppCard({ app, lang, index }: { app: AppItem; lang: Lang; index: number }) {
  return (
    <li className="rise" style={{ animationDelay: `${index * 80}ms` }}>
      <Link
        href={langHref(lang, `/apps/${app.slug}`)}
        className="group flex h-full flex-col rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-[0_1px_2px_rgba(21,32,47,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-line-strong)] hover:shadow-[0_12px_32px_rgba(21,32,47,0.10)] sm:p-7"
      >
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[16px] border border-[var(--color-line)] bg-[var(--color-surface)]">
            {app.icon ? (
              <Image src={app.icon} alt="" fill sizes="64px" className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xl font-bold text-[var(--color-muted)]">
                {pick(app.name, lang).slice(0, 1)}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center rounded-full bg-[var(--color-brand-soft)] px-2.5 py-0.5 text-[0.7rem] font-semibold text-[var(--color-brand)]">
              {t(app.kind === 'game' ? 'game' : 'app', lang)}
            </span>
            <h3 className="mt-1.5 text-lg font-bold tracking-tight">{pick(app.name, lang)}</h3>
          </div>
        </div>

        <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-[var(--color-ink-2)]">
          {pick(app.tagline, lang)}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-[var(--color-line)] pt-4">
          <div className="flex flex-wrap gap-1.5">
            {app.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-[var(--color-surface)] px-2 py-1 text-[0.7rem] text-[var(--color-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)]">
            {t('viewDetail', lang)}
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </li>
  )
}
