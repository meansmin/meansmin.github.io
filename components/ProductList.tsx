'use client'

import { useState } from 'react'
import type { AppItem, Lang } from '@/lib/types'
import { t } from '@/lib/i18n'
import AppCard from './AppCard'

type Filter = 'all' | 'game' | 'app'

export default function ProductList({ apps, lang }: { apps: AppItem[]; lang: Lang }) {
  const [filter, setFilter] = useState<Filter>('all')

  const counts = {
    all: apps.length,
    game: apps.filter((a) => a.kind === 'game').length,
    app: apps.filter((a) => a.kind === 'app').length,
  }

  const tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: t('filterAll', lang) },
    { key: 'game', label: t('filterGames', lang) },
    { key: 'app', label: t('filterApps', lang) },
  ]

  const shown = filter === 'all' ? apps : apps.filter((a) => a.kind === filter)

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label={t('productsTitle', lang)}>
        {tabs.map((tab) => {
          const active = filter === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              aria-pressed={active}
              className={
                'flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ' +
                (active
                  ? 'border-[var(--color-brand)] bg-[var(--color-brand)] text-white'
                  : 'border-[var(--color-line-strong)] bg-white text-[var(--color-ink-2)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]')
              }
            >
              {tab.label}
              <span
                className={
                  'font-[family-name:var(--font-mono)] text-xs ' +
                  (active ? 'text-white/70' : 'text-[var(--color-muted)]')
                }
              >
                {counts[tab.key]}
              </span>
            </button>
          )
        })}
      </div>

      {shown.length > 0 ? (
        /* key 를 필터에 묶어 두면 탭을 바꿀 때마다 카드 등장 애니메이션이 다시 돈다 */
        <ul key={filter} className="mt-8 grid gap-5 sm:grid-cols-2">
          {shown.map((a, i) => (
            <AppCard key={a.slug} app={a} lang={lang} index={i} />
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-2xl border border-dashed border-[var(--color-line-strong)] px-6 py-14 text-center text-[var(--color-muted)]">
          {t('filterEmpty', lang)}
        </p>
      )}
    </>
  )
}
