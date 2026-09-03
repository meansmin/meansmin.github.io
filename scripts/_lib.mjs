// 데이터 스크립트 공용 유틸. 여기에는 부작용이 없는 함수만 둔다.
import fs from 'node:fs'
import path from 'node:path'

export const ROOT = path.resolve(process.cwd())
export const CONTENT_DIR = path.join(ROOT, 'content')

export function log(tag, msg) {
  console.log(`[${tag}] ${msg}`)
}
export function warn(tag, msg) {
  console.warn(`[${tag}] ⚠ ${msg}`)
}

export function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}

export function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return fallback
  }
}

export function writeJson(file, data) {
  ensureDir(path.dirname(file))
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

/** 슬러그 형식 검사: 영어 소문자, 숫자, 하이픈만 */
export function isValidSlug(s) {
  return typeof s === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)
}

export function isHttpUrl(s) {
  if (typeof s !== 'string' || s === '') return false
  try {
    const u = new URL(s)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}
