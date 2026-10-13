import fs from 'node:fs'
import path from 'node:path'
import { getPublishedApps } from './apps'

export interface HistoryItem {
  /** YYYY-MM */
  date: string
  text: { ko: string; en: string }
  /** 앱 출시 항목이면 상세 페이지로 링크한다 */
  slug?: string
  kind: 'event' | 'release'
}

/** content/history.json 의 사건 + apps.json 의 출시일을 합쳐 오래된 순으로 돌려준다. 파일이 없어도 출시 항목만으로 계속 나간다. */
export function getHistory(): HistoryItem[] {
  let events: HistoryItem[] = []
  try {
    const file = path.join(process.cwd(), 'content', 'history.json')
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    if (Array.isArray(data.items)) {
      events = data.items
        .filter((i: { date?: string }) => typeof i.date === 'string')
        .map((i: { date: string; text: { ko: string; en: string } }) => ({
          date: i.date.slice(0, 7),
          text: i.text,
          kind: 'event' as const,
        }))
    }
  } catch {
    /* 사건 파일이 없으면 출시 항목만 */
  }
  const releases: HistoryItem[] = getPublishedApps()
    .filter((a) => a.releaseDate)
    .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))
    .map((a) => ({
      date: a.releaseDate.slice(0, 7),
      text: { ko: `${a.name.ko} 출시`, en: `${a.name.en} released` },
      slug: a.slug,
      kind: 'release' as const,
    }))
  // 같은 달이면 사건이 출시보다 먼저. Array.sort 는 안정 정렬이라 출시끼리는 위의 releaseDate 순서가 유지된다.
  return [...events, ...releases].sort((x, y) => x.date.localeCompare(y.date))
}
