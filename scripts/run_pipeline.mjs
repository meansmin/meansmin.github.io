#!/usr/bin/env node
/**
 * 데이터 파이프라인 오케스트레이터.
 * 각 단계를 별도 프로세스로 돌린다 — 한 단계가 죽어도 다음 단계는 그대로 진행된다.
 */
import { spawnSync } from 'node:child_process'

const steps = [
  ['1_fetch_notion.mjs', '노션에서 받아오기'],
  ['2_normalize.mjs', '표준 형식으로 바꾸기'],
  ['3_validate.mjs', '검사하기'],
  ['4_download_media.mjs', '이미지 내려받기'],
]

const results = []
for (const [file, label] of steps) {
  console.log(`\n──────── ${label} (${file}) ────────`)
  const r = spawnSync(process.execPath, [`scripts/${file}`], { stdio: 'inherit' })
  const code = r.status ?? 1
  results.push({ file, label, code })
  if (code !== 0) {
    console.warn(`⚠ ${label} 단계가 비정상 종료(코드 ${code})했지만 다음 단계로 넘어간다.`)
  }
}

console.log('\n──────── 요약 ────────')
for (const r of results) {
  console.log(`${r.code === 0 ? '✔' : '✖'} ${r.label}`)
}
// 파이프라인 자체는 항상 성공으로 끝낸다. 데이터가 없으면 빌드 단계가 판단한다.
process.exit(0)
