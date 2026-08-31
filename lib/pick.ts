import type { Lang } from './types'

/**
 * 언어별 값 고르기.
 * `lib/apps.ts` 는 파일을 읽느라 fs 를 쓰기 때문에 클라이언트 컴포넌트가 import 할 수 없다.
 * 그래서 이 순수 함수만 따로 둔다.
 */
export function pick(v: { ko: string; en: string } | undefined, lang: Lang): string {
  if (!v) return ''
  if (lang === 'en') return v.en || v.ko || ''
  return v.ko || v.en || ''
}
