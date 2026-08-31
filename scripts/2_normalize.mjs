#!/usr/bin/env node
/**
 * 2단계 — .cache/notion-raw.json 을 사이트가 쓰는 표준 형식(content/apps.json)으로 바꾼다.
 *
 * 설계 원칙
 * - 캐시가 없으면 기존 content/apps.json 을 건드리지 않고 그대로 둔다.
 * - 항목 하나가 깨져도 그 항목만 버리고 나머지는 살린다.
 */
import path from 'node:path'
import { CACHE_DIR, CONTENT_DIR, log, warn, readJson, writeJson, plain } from './_lib.mjs'
import { blocksToMarkdown, splitLangBody } from './_notion_markdown.mjs'

const TAG = '2-normalize'
const RAW = path.join(CACHE_DIR, 'notion-raw.json')
const OUT = path.join(CONTENT_DIR, 'apps.json')

const KIND = { '게임': 'game', '앱': 'app' }
const STATUS = { '출시': 'released', '개발 중': 'developing', '기획 중': 'planning', '보류': 'paused' }

function prop(props, name) {
  return props?.[name]
}

function textOf(p) {
  if (!p) return ''
  if (p.type === 'title') return plain(p.title)
  if (p.type === 'rich_text') return plain(p.rich_text)
  return ''
}

function fileUrls(p) {
  if (!p || p.type !== 'files') return []
  return (p.files || [])
    .map((f) => (f.type === 'external' ? f.external?.url : f.file?.url))
    .filter(Boolean)
}

function normalizeOne(page) {
  const props = page.properties || {}
  const slug = textOf(prop(props, '슬러그'))
  const md = blocksToMarkdown(page.blocks)
  const body = splitLangBody(md)
  const date = prop(props, '출시일')

  return {
    slug,
    notionId: page.id,
    published: prop(props, '공개')?.checkbox === true,
    name: {
      ko: textOf(prop(props, '이름')),
      en: textOf(prop(props, 'Name (EN)')),
    },
    tagline: {
      ko: textOf(prop(props, '한 줄 소개')),
      en: textOf(prop(props, 'Tagline (EN)')),
    },
    body,
    kind: KIND[prop(props, '종류')?.select?.name] || 'app',
    status: STATUS[prop(props, '상태')?.select?.name] || 'developing',
    platforms: (prop(props, '플랫폼')?.multi_select || []).map((o) => o.name),
    tags: (prop(props, '태그')?.multi_select || []).map((o) => o.name),
    storeUrl: prop(props, '스토어 링크')?.url || '',
    privacyUrl: prop(props, '방침 링크')?.url || '',
    releaseDate: date?.date?.start || '',
    order: typeof prop(props, '정렬')?.number === 'number' ? prop(props, '정렬').number : 999,
    // 원격 파일 주소는 4단계에서 내려받아 로컬 경로로 바뀐다.
    remote: {
      icon: fileUrls(prop(props, '아이콘'))[0] || '',
      screenshots: fileUrls(prop(props, '스크린샷')),
    },
  }
}

function main() {
  const raw = readJson(RAW)
  if (!raw || !Array.isArray(raw.pages) || raw.pages.length === 0) {
    warn(TAG, '노션 캐시가 없다 — 기존 content/apps.json 을 그대로 둔다.')
    process.exit(0)
  }

  const prev = readJson(OUT, { apps: [] })
  const prevBySlug = new Map((prev.apps || []).map((a) => [a.slug, a]))

  const apps = []
  for (const page of raw.pages) {
    try {
      const a = normalizeOne(page)
      // 노션에 파일을 안 올렸으면 이전에 쓰던 로컬 이미지를 유지한다.
      const old = prevBySlug.get(a.slug)
      a.icon = old?.icon || ''
      a.screenshots = old?.screenshots || []
      apps.push(a)
    } catch (e) {
      warn(TAG, `항목 변환 실패(${page.id}): ${e.message} — 이 항목만 건너뛴다.`)
    }
  }

  if (apps.length === 0) {
    warn(TAG, '변환된 항목이 0건이다 — 기존 파일을 지키기 위해 쓰지 않는다.')
    process.exit(0)
  }

  apps.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))
  writeJson(OUT, { generatedAt: new Date().toISOString(), source: 'notion', apps })
  log(TAG, `${apps.length}건을 content/apps.json 에 썼다.`)
}

main()
