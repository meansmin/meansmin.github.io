#!/usr/bin/env node
/**
 * 6단계 — 빌드 산출물(out/) 점검.
 * 페이지가 다 나왔는지, HTML 이 참조하는 이미지가 실제로 있는지 본다.
 * 문제를 찾으면 알리되, 배포 여부는 사람이 판단하도록 종료 코드는 0 으로 둔다.
 */
import fs from 'node:fs'
import path from 'node:path'
import { readJson, log, warn } from './_lib.mjs'

const TAG = '6-verify'
const OUT = path.join(process.cwd(), 'out')

if (!fs.existsSync(OUT)) {
  warn(TAG, 'out/ 폴더가 없다 — 빌드를 먼저 돌려야 한다.')
  process.exit(0)
}

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, acc)
    else acc.push(p)
  }
  return acc
}

const files = walk(OUT)
const htmls = files.filter((f) => f.endsWith('.html'))
const data = readJson(path.join(process.cwd(), 'content', 'apps.json'), { apps: [] })
const published = (data.apps || []).filter((a) => a.published)

let problems = 0

// 1) 기대하는 페이지가 다 있는가
const expected = ['index.html', path.join('en', 'index.html'), path.join('contact', 'index.html')]
for (const a of published) {
  expected.push(path.join('apps', a.slug, 'index.html'))
  expected.push(path.join('en', 'apps', a.slug, 'index.html'))
}
for (const rel of expected) {
  if (!fs.existsSync(path.join(OUT, rel))) {
    problems++
    warn(TAG, `페이지 없음: ${rel}`)
  }
}

// 2) HTML 이 참조하는 로컬 이미지가 실제로 있는가
const missing = new Set()
for (const h of htmls) {
  const src = fs.readFileSync(h, 'utf8')
  for (const m of src.matchAll(/(?:src|href)="(\/media\/[^"?]+)/g)) {
    const rel = decodeURIComponent(m[1]).replace(/^\//, '')
    if (!fs.existsSync(path.join(OUT, rel))) missing.add(rel)
  }
}
for (const m of missing) {
  problems++
  warn(TAG, `이미지 없음: /${m}`)
}

// 3) sitemap 존재
if (!fs.existsSync(path.join(OUT, 'sitemap.xml'))) {
  problems++
  warn(TAG, 'sitemap.xml 이 없다')
}

// 4) GitHub Pages 가 _next 폴더를 Jekyll 로 지우지 않도록 .nojekyll 보장
const nojekyll = path.join(OUT, '.nojekyll')
if (!fs.existsSync(nojekyll)) {
  fs.writeFileSync(nojekyll, '')
  log(TAG, '.nojekyll 을 만들었다 (GitHub Pages 가 _next 폴더를 건너뛰게 한다)')
}

log(TAG, `HTML ${htmls.length}개 · 공개 앱 ${published.length}개 · 문제 ${problems}건`)
if (problems > 0) warn(TAG, '문제가 있다. 배포 전에 확인할 것.')
