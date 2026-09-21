import Link from 'next/link'
import Image from 'next/image'
import type { AppItem, Lang } from '@/lib/types'
import type { UpcomingItem } from '@/lib/upcoming'
import { pick } from '@/lib/pick'
import { t, langHref } from '@/lib/i18n'

/**
 * 출시 타임라인. 왼쪽은 실제 출시일 순서, 오른쪽은 준비 중인 작품이다.
 * 선이 미래 쪽으로 옅어지며 사라진다 — "다음이 있다"를 장식이 아니라 데이터로 보여준다.
 */
export default function ReleaseRail({
  apps,
  upcoming,
  lang,
}: {
  apps: AppItem[]
  upcoming: UpcomingItem[]
  lang: Lang
}) {
  const released = [...apps]
    .filter((a) => a.releaseDate)
    .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))

  const fmt = (d: string) => {
    const [, m, day] = d.split('-')
    return `${m}.${day}`
  }
  const year = released[0]?.releaseDate.slice(0, 4)

  return (
    <div className="rail-wrap" aria-label={t('railLabel', lang)}>
      <ol className="rail">
        {released.map((a, i) => (
          <li key={a.slug} className="node past" style={{ ['--i' as string]: i }}>
            <Link href={langHref(lang, `/apps/${a.slug}`)} className="node-link">
              <span className="node-dot">
                {a.icon && <Image src={a.icon} alt="" width={28} height={28} />}
              </span>
              <span className="node-date">
                {i === 0 && year ? `${year}.` : ''}
                {fmt(a.releaseDate)}
              </span>
              <span className="node-name">{pick(a.name, lang)}</span>
            </Link>
          </li>
        ))}
        {upcoming.map((u, i) => (
          <li key={u.slug} className="node future" style={{ ['--i' as string]: released.length + i }}>
            <span className="node-link">
              <span className="node-dot" />
              <span className="node-date">{t('railSoon', lang)}</span>
              <span className="node-name">{pick(u.name, lang)}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
