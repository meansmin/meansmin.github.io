import fs from 'node:fs'
import path from 'node:path'
import type { AppItem, AppsFile } from './types'

/** content/apps.json 을 읽는다. 파일이 없거나 깨져도 빈 목록으로 돌려 빌드를 막지 않는다. */
function load(): AppsFile {
  try {
    const file = path.join(process.cwd(), 'content', 'apps.json')
    const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as AppsFile
    if (!Array.isArray(raw.apps)) throw new Error('apps 배열이 없다')
    return raw
  } catch (e) {
    console.warn('[site] content/apps.json 을 읽지 못했다 — 빈 목록으로 빌드한다.', e)
    return { generatedAt: '', source: 'empty', apps: [] }
  }
}

export function getPublishedApps(): AppItem[] {
  return load()
    .apps.filter((a) => a.published && a.slug)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.slug.localeCompare(b.slug))
}

export function getAppBySlug(slug: string): AppItem | undefined {
  return getPublishedApps().find((a) => a.slug === slug)
}

// 언어별 값 고르기는 클라이언트에서도 써야 해서 lib/pick.ts 로 옮겼다. 기존 import 를 위해 재수출한다.
export { pick } from './pick'
