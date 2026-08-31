#!/usr/bin/env node
/**
 * 4단계 — 노션이 준 이미지 주소를 파일로 내려받아 public/media 아래에 둔다.
 *
 * 왜 필요한가
 *   노션 API 가 주는 파일 주소는 **1시간이면 만료(403)** 되는 임시 링크다.
 *   그대로 <img src> 에 박으면 한 시간 뒤 사이트의 모든 이미지가 깨진다.
 *
 * 설계 원칙
 * - 이미지 하나가 실패해도 그 항목만 이전 파일을 그대로 쓰고 넘어간다.
 * - 노션에 파일이 없으면 이미 public/media 에 있는 파일을 쓴다(수동 배치 허용).
 */
import fs from 'node:fs'
import path from 'node:path'
import { CONTENT_DIR, MEDIA_DIR, log, warn, readJson, writeJson, ensureDir } from './_lib.mjs'

const TAG = '4-media'
const FILE = path.join(CONTENT_DIR, 'apps.json')
const TIMEOUT_MS = 20000

function extOf(url, fallback = '.png') {
  try {
    const p = new URL(url).pathname
    const e = path.extname(p).toLowerCase()
    return ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(e) ? e : fallback
  } catch {
    return fallback
  }
}

async function download(url, dest) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 100) throw new Error(`내용이 너무 작다(${buf.length}바이트)`)
    ensureDir(path.dirname(dest))
    fs.writeFileSync(dest, buf)
    return buf.length
  } finally {
    clearTimeout(timer)
  }
}

function localExists(webPath) {
  if (!webPath) return false
  return fs.existsSync(path.join(process.cwd(), 'public', webPath.replace(/^\//, '')))
}

async function main() {
  const data = readJson(FILE)
  if (!data || !Array.isArray(data.apps)) {
    warn(TAG, 'content/apps.json 을 읽지 못했다 — 내려받기를 건너뛴다.')
    process.exit(0)
  }

  let ok = 0
  let failed = 0
  let kept = 0

  for (const a of data.apps) {
    const dir = path.join(MEDIA_DIR, a.slug || 'unknown')

    // 아이콘
    const remoteIcon = a.remote?.icon
    if (remoteIcon) {
      const dest = path.join(dir, 'icon' + extOf(remoteIcon))
      try {
        const size = await download(remoteIcon, dest)
        a.icon = '/media/' + path.relative(MEDIA_DIR, dest).split(path.sep).join('/')
        ok++
        log(TAG, `${a.slug} 아이콘 (${Math.round(size / 1024)}KB)`)
      } catch (e) {
        failed++
        warn(TAG, `${a.slug} 아이콘 실패: ${e.message} — ${localExists(a.icon) ? '기존 파일을 유지한다.' : '아이콘 없이 나간다.'}`)
        if (!localExists(a.icon)) a.icon = ''
      }
    } else if (localExists(a.icon)) {
      kept++
    }

    // 스크린샷
    const remoteShots = a.remote?.screenshots || []
    if (remoteShots.length > 0) {
      const paths = []
      for (let i = 0; i < remoteShots.length; i++) {
        const url = remoteShots[i]
        const dest = path.join(dir, `shot${i + 1}` + extOf(url, '.jpg'))
        try {
          await download(url, dest)
          paths.push('/media/' + path.relative(MEDIA_DIR, dest).split(path.sep).join('/'))
          ok++
        } catch (e) {
          failed++
          warn(TAG, `${a.slug} 스크린샷 ${i + 1} 실패: ${e.message} — 이 장만 건너뛴다.`)
        }
      }
      // 한 장도 못 받았으면 기존 목록을 지키는 편이 낫다.
      if (paths.length > 0) a.screenshots = paths
      else warn(TAG, `${a.slug} 스크린샷을 한 장도 받지 못해 기존 목록을 그대로 둔다.`)
    } else {
      a.screenshots = (a.screenshots || []).filter(localExists)
      kept += a.screenshots.length
    }
  }

  writeJson(FILE, data)
  log(TAG, `내려받기 ${ok}건, 실패 ${failed}건, 기존 파일 유지 ${kept}건`)
}

main().catch((e) => {
  warn(TAG, `예상치 못한 오류: ${e.message} — 기존 이미지를 그대로 쓴다.`)
  process.exit(0)
})
