#!/usr/bin/env node
/**
 * content/apps.json 을 검사한다. (`npm run data`)
 *
 * content/apps.json 이 사이트 내용의 원본이다. 사람이 직접 고치므로
 * 오타·필수값 누락을 배포 전에 잡는 것이 이 스크립트의 역할이다.
 *
 * 설계 원칙
 * - 문제가 있는 항목은 **지우지 않고** published 를 꺼서 사이트에서만 빠지게 한다(데이터 보존).
 * - 검사 결과는 content/validation-report.json 에 남긴다.
 * - 검사 자체가 실패해도 빌드를 막지 않는다.
 */
import path from 'node:path'
import { CONTENT_DIR, log, warn, readJson, writeJson, isValidSlug, isHttpUrl } from './_lib.mjs'

const TAG = '3-validate'
const FILE = path.join(CONTENT_DIR, 'apps.json')
const REPORT = path.join(CONTENT_DIR, 'validation-report.json')

function validate(apps) {
  const seen = new Map()
  const report = []

  for (const a of apps) {
    const errors = []
    const warnings = []

    if (!isValidSlug(a.slug)) {
      errors.push(`슬러그가 비었거나 형식이 잘못됨(영어 소문자·숫자·하이픈만): "${a.slug ?? ''}"`)
    } else if (seen.has(a.slug)) {
      errors.push(`슬러그 중복: "${a.slug}" (먼저 등록된 "${seen.get(a.slug)}" 를 남긴다)`)
    } else {
      seen.set(a.slug, a.name?.ko || a.slug)
    }

    if (!a.name?.ko) errors.push('한국어 이름이 비었음')
    if (!a.tagline?.ko) warnings.push('한 줄 소개(한국어)가 비었음')
    if (!a.name?.en) warnings.push('영어 이름이 비어 한국어 이름으로 대체된다')
    if (!a.tagline?.en) warnings.push('영어 한 줄 소개가 비어 영어 페이지에 한국어가 노출될 수 있다')
    if (!a.body?.ko) warnings.push('상세 소개(한국어) 본문이 비었음')

    if (a.storeUrl && !isHttpUrl(a.storeUrl)) errors.push(`스토어 링크가 URL 형식이 아님: ${a.storeUrl}`)
    if (a.privacyUrl && !isHttpUrl(a.privacyUrl)) errors.push(`방침 링크가 URL 형식이 아님: ${a.privacyUrl}`)
    if (a.status === 'released' && !a.storeUrl) warnings.push('출시 상태인데 스토어 링크가 없음')
    if (a.releaseDate && !/^\d{4}-\d{2}-\d{2}$/.test(a.releaseDate)) {
      warnings.push(`출시일 형식이 YYYY-MM-DD 가 아님: ${a.releaseDate}`)
    }
    if (!a.icon) warnings.push('아이콘이 없어 기본 자리표시자로 그려진다')
    if (!a.screenshots?.length) warnings.push('스크린샷이 한 장도 없어 상세 페이지가 비어 보인다')

    const blocked = errors.length > 0
    if (blocked && a.published) {
      a.published = false
      a._blockedByValidation = true
    }
    a._issues = { errors, warnings }

    if (errors.length || warnings.length) {
      report.push({ slug: a.slug || '(슬러그 없음)', name: a.name?.ko || '', errors, warnings })
    }
  }
  return report
}

function main() {
  const data = readJson(FILE)
  if (!data || !Array.isArray(data.apps)) {
    warn(TAG, 'content/apps.json 을 읽지 못했다 — 검사를 건너뛴다.')
    process.exit(0)
  }

  const report = validate(data.apps)
  writeJson(FILE, data)
  writeJson(REPORT, { checkedAt: new Date().toISOString(), items: report })

  const errCount = report.reduce((n, r) => n + r.errors.length, 0)
  const warnCount = report.reduce((n, r) => n + r.warnings.length, 0)
  const publishable = data.apps.filter((a) => a.published).length

  for (const r of report) {
    for (const e of r.errors) warn(TAG, `[${r.slug}] 오류: ${e}`)
    for (const w of r.warnings) warn(TAG, `[${r.slug}] 주의: ${w}`)
  }
  log(TAG, `검사 완료 — 오류 ${errCount}건, 주의 ${warnCount}건, 공개 가능 ${publishable}건 / 전체 ${data.apps.length}건`)

  if (publishable === 0) {
    warn(TAG, '공개 가능한 항목이 하나도 없다. 사이트가 빈 목록으로 나간다.')
  }
}

main()
