#!/usr/bin/env node
/**
 * 1단계 — 노션에서 원본 데이터를 받아 .cache/notion-raw.json 에 저장한다.
 *
 * 설계 원칙
 * - 토큰이 없거나 노션이 죽어 있어도 **절대 빌드를 막지 않는다**. 직전 캐시가 있으면 그대로 두고 종료한다.
 * - 새로 받은 데이터가 비정상(0건)이면 기존 캐시를 덮어쓰지 않는다.
 */
import { Client, collectPaginatedAPI, isFullPage } from '@notionhq/client'
import path from 'node:path'
import fs from 'node:fs'
import { CACHE_DIR, log, warn, readJson, writeJson } from './_lib.mjs'

const TAG = '1-fetch'
const RAW = path.join(CACHE_DIR, 'notion-raw.json')

const token = process.env.NOTION_TOKEN
const dataSourceId = process.env.NOTION_DATA_SOURCE_ID

function finishWithoutFetch(reason) {
  const cached = readJson(RAW)
  if (cached) {
    warn(TAG, `${reason} — 직전 캐시(${cached.pages?.length ?? 0}건)로 계속 진행한다.`)
  } else {
    warn(TAG, `${reason} — 캐시도 없다. 다음 단계는 기존 content/apps.json 을 그대로 쓴다.`)
  }
  process.exit(0)
}

if (!token || !dataSourceId) {
  finishWithoutFetch('NOTION_TOKEN 또는 NOTION_DATA_SOURCE_ID 가 없다')
}

const notion = new Client({ auth: token })

async function fetchBlocks(blockId, depth = 0) {
  if (depth > 2) return []
  const blocks = await collectPaginatedAPI(notion.blocks.children.list, { block_id: blockId })
  const out = []
  for (const b of blocks) {
    const item = { type: b.type, data: b[b.type] }
    if (b.has_children) {
      try {
        item.children = await fetchBlocks(b.id, depth + 1)
      } catch (e) {
        warn(TAG, `하위 블록 조회 실패(${b.id}): ${e.message}`)
        item.children = []
      }
    }
    out.push(item)
  }
  return out
}

async function main() {
  let pages
  try {
    pages = await collectPaginatedAPI(notion.dataSources.query, { data_source_id: dataSourceId })
  } catch (e) {
    finishWithoutFetch(`노션 조회 실패: ${e.message}`)
    return
  }

  const full = pages.filter(isFullPage)
  if (full.length === 0) {
    finishWithoutFetch('노션에서 받은 항목이 0건이다')
    return
  }

  const result = []
  for (const p of full) {
    let blocks = []
    try {
      blocks = await fetchBlocks(p.id)
    } catch (e) {
      warn(TAG, `본문 조회 실패(${p.id}): ${e.message} — 본문 없이 담는다.`)
    }
    result.push({ id: p.id, properties: p.properties, blocks })
  }

  const payload = { fetchedAt: new Date().toISOString(), dataSourceId, pages: result }
  writeJson(RAW, payload)
  log(TAG, `노션에서 ${result.length}건 받아 ${path.relative(process.cwd(), RAW)} 에 저장했다.`)
}

main().catch((e) => {
  // 예기치 못한 오류도 빌드를 막지 않는다.
  warn(TAG, `예상치 못한 오류: ${e.stack || e.message}`)
  const cached = fs.existsSync(RAW)
  warn(TAG, cached ? '직전 캐시로 계속 진행한다.' : '캐시가 없어 기존 content/apps.json 을 쓴다.')
  process.exit(0)
})
