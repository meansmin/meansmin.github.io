import fs from 'node:fs'
import path from 'node:path'

export interface UpcomingItem {
  slug: string
  name: { ko: string; en: string }
  kind: 'game' | 'app'
  genre: { ko: string; en: string }
  stage: 'planning' | 'developing' | 'testing'
}

/** content/upcoming.json — 준비 중인 작품. 파일이 없거나 깨져도 빈 배열로 사이트는 계속 나간다. */
export function getUpcoming(): UpcomingItem[] {
  try {
    const file = path.join(process.cwd(), 'content', 'upcoming.json')
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    return Array.isArray(data.items) ? data.items : []
  } catch {
    return []
  }
}
