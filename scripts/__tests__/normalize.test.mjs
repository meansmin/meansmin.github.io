#!/usr/bin/env node
/**
 * 2_normalize 검증 — 실제 노션 API 응답 모양을 흉내 낸 픽스처로 돌린다.
 * 토큰 없이도 파싱 로직이 맞는지 확인할 수 있다. `node scripts/__tests__/normalize.test.mjs`
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { spawnSync } from 'node:child_process'

const root = path.resolve(process.cwd())
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'norm-'))
let failures = 0

function check(label, cond, extra = '') {
  if (cond) console.log(`  ✔ ${label}`)
  else {
    failures++
    console.error(`  ✖ ${label} ${extra}`)
  }
}

// 노션 API 가 실제로 돌려주는 속성 구조
const raw = {
  fetchedAt: new Date().toISOString(),
  pages: [
    {
      id: 'page-1',
      properties: {
        이름: { type: 'title', title: [{ plain_text: '테스트 앱' }] },
        'Name (EN)': { type: 'rich_text', rich_text: [{ plain_text: 'Test App' }] },
        슬러그: { type: 'rich_text', rich_text: [{ plain_text: 'test-app' }] },
        종류: { type: 'select', select: { name: '게임' } },
        상태: { type: 'select', select: { name: '출시' } },
        공개: { type: 'checkbox', checkbox: true },
        플랫폼: { type: 'multi_select', multi_select: [{ name: 'Android' }, { name: 'iOS' }] },
        '한 줄 소개': { type: 'rich_text', rich_text: [{ plain_text: '한 줄' }] },
        'Tagline (EN)': { type: 'rich_text', rich_text: [{ plain_text: 'One line' }] },
        아이콘: { type: 'files', files: [{ type: 'file', file: { url: 'https://x.test/icon.png' } }] },
        스크린샷: {
          type: 'files',
          files: [
            { type: 'file', file: { url: 'https://x.test/a.jpg' } },
            { type: 'external', external: { url: 'https://x.test/b.jpg' } },
          ],
        },
        '스토어 링크': { type: 'url', url: 'https://play.google.com/store/apps/details?id=a.b' },
        '방침 링크': { type: 'url', url: null },
        출시일: { type: 'date', date: { start: '2026-01-02' } },
        태그: { type: 'multi_select', multi_select: [{ name: '퍼즐' }] },
        정렬: { type: 'number', number: 7 },
      },
      blocks: [
        { type: 'paragraph', data: { rich_text: [{ plain_text: '한국어 본문', annotations: {} }] } },
        { type: 'heading_2', data: { rich_text: [{ plain_text: 'EN', annotations: {} }] } },
        { type: 'paragraph', data: { rich_text: [{ plain_text: 'English body', annotations: {} }] } },
      ],
    },
    {
      // 값이 거의 비어 있는 항목 — 죽지 않고 기본값으로 채워야 한다
      id: 'page-2',
      properties: {
        이름: { type: 'title', title: [] },
        슬러그: { type: 'rich_text', rich_text: [] },
      },
      blocks: [],
    },
  ],
}

// 격리된 작업 폴더에 스크립트와 입력을 놓고 실행한다
fs.mkdirSync(path.join(tmp, 'scripts'), { recursive: true })
fs.mkdirSync(path.join(tmp, '.cache'), { recursive: true })
fs.mkdirSync(path.join(tmp, 'content'), { recursive: true })
for (const f of ['2_normalize.mjs', '_lib.mjs', '_notion_markdown.mjs']) {
  fs.copyFileSync(path.join(root, 'scripts', f), path.join(tmp, 'scripts', f))
}
fs.writeFileSync(path.join(tmp, '.cache', 'notion-raw.json'), JSON.stringify(raw))

const r = spawnSync(process.execPath, ['scripts/2_normalize.mjs'], { cwd: tmp, encoding: 'utf8' })
console.log('--- 2_normalize 실행 ---')
console.log((r.stdout + r.stderr).trim().split('\n').map((l) => '  ' + l).join('\n'))

const out = JSON.parse(fs.readFileSync(path.join(tmp, 'content', 'apps.json'), 'utf8'))
const a = out.apps.find((x) => x.slug === 'test-app')
const b = out.apps.find((x) => x.notionId === 'page-2')

console.log('--- 검증 ---')
check('종료 코드 0', r.status === 0, `실제 ${r.status}`)
check('두 항목 모두 변환됨', out.apps.length === 2, `실제 ${out.apps.length}`)
check('제목 파싱', a?.name.ko === '테스트 앱')
check('영어 이름 파싱', a?.name.en === 'Test App')
check('체크박스 → published', a?.published === true)
check('select → kind 매핑', a?.kind === 'game')
check('select → status 매핑', a?.status === 'released')
check('multi_select 파싱', a?.platforms.join(',') === 'Android,iOS')
check('URL 파싱', a?.storeUrl.startsWith('https://play.google.com/'))
check('null URL 은 빈 문자열', a?.privacyUrl === '')
check('날짜 파싱', a?.releaseDate === '2026-01-02')
check('숫자 파싱', a?.order === 7)
check('파일 URL(file/external 혼합) 수집', a?.remote.screenshots.length === 2)
check('본문 한국어 분리', a?.body.ko === '한국어 본문', JSON.stringify(a?.body.ko))
check('본문 영어 분리', a?.body.en === 'English body', JSON.stringify(a?.body.en))
check('빈 항목도 죽지 않고 변환', !!b)
check('빈 항목 기본값 — published false', b?.published === false)
check('빈 항목 기본값 — order 999', b?.order === 999)
check('정렬은 order 오름차순', out.apps[0].order <= out.apps[1].order)

fs.rmSync(tmp, { recursive: true, force: true })
console.log(failures === 0 ? '\n전부 통과' : `\n실패 ${failures}건`)
process.exit(failures === 0 ? 0 : 1)
