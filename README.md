# C&C F. 홈페이지

앱·게임 소개 홈페이지. **저장소 안의 데이터 파일이 원본**이고, 정적 사이트로 빌드해 **GitHub Pages**에 배포한다.

- 공개 주소: https://ccfsoft.com
- 저장소: https://github.com/meansmin/meansmin.github.io
- 내용 원본: `content/apps.json`

> ⚠ **`public/app-ads.txt` 는 지우면 안 됩니다.**
> AdMob 퍼블리셔 인증 파일이라 `https://ccfsoft.com/app-ads.txt` 주소가 살아 있어야
> 앱의 광고 수익 인증이 유지됩니다. 이 파일은 빌드할 때 사이트 최상단으로 복사됩니다.

---

## 어떻게 돌아가나

```
content/apps.json  ──(push)──▶  GitHub Actions 빌드  ──▶  GitHub Pages
   내용 원본                       1~3분                  방문자가 보는 곳
```

1. `content/apps.json` 을 고친다
2. `npm run data` 로 검사한다 (오타·필수값 누락을 여기서 잡는다)
3. commit + push 하면 GitHub Actions 가 알아서 빌드·배포한다
4. 1~3분 뒤 사이트에 반영된다

Actions 탭의 `사이트 빌드 및 배포` → **Run workflow** 로 언제든 다시 돌릴 수 있다.

> 2026-09-03 이전에는 노션 DB를 관리자 페이지로 쓰고 빌드 때 받아왔다.
> 실사용을 안 해 원본이 두 곳으로 갈라지는 위험만 남아서 걷어냈다.
> 되살리려면 그 커밋을 `git revert` 하면 된다.

## 처음 한 번만 해야 하는 설정

### 문의 폼 (선택)

1. https://formspree.io 에서 무료 가입 후 폼을 만든다 (무료 플랜 월 50건)
2. 발급된 폼 ID(`abcdwxyz` 형태)를 GitHub → Settings → Secrets and variables → Actions →
   **Variables** 탭 → `FORMSPREE_ID` 로 등록한다

Secrets 가 아니라 **Variables** 다. 워크플로가 `vars.FORMSPREE_ID` 로 읽고, 이 값은 어차피
완성된 HTML 에 그대로 박혀 공개되므로 숨길 수 있는 값이 아니다.

등록하지 않으면 문의 페이지에 폼 대신 메일 주소만 표시된다.

### GitHub Pages — 설정 완료

저장소 Settings → Pages 의 Source 는 이미 **GitHub Actions** 로 맞춰져 있다. 다시 만질 일은 없다.

---

## 로컬에서 돌려보기

```bash
npm install
npm run data      # content/apps.json 검사
npm run dev       # http://localhost:3000
npm run build     # 정적 빌드 → out/ (postbuild 로 산출물 점검까지)
```

## 폴더 구조

| 경로 | 설명 |
|---|---|
| `content/apps.json` | **사이트 내용의 원본.** 앱 목록·소개·링크가 전부 여기 있다 |
| `public/media/<슬러그>/` | 아이콘·스크린샷. `apps.json` 의 경로가 여기를 가리킨다 |
| `public/policy/<슬러그>/` | 앱별 개인정보처리방침 (앱에서 링크로 연다 — 주소를 바꾸면 안 된다) |
| `scripts/` | 검사·점검 스크립트. 기능별로 나뉘어 하나가 실패해도 나머지가 돈다 |
| `app/` | 페이지 (한국어는 `/`, 영어는 `/en`) |
| `components/` | 화면 구성요소 |
| `lib/` | 데이터 로더, 다국어 문구, 마크다운 렌더러 |

## 스크립트

| 스크립트 | 언제 도나 | 하는 일 | 실패하면 |
|---|---|---|---|
| `3_validate.mjs` | `npm run data` | 슬러그·링크·필수값 검사 | 문제 항목만 비공개 처리, 빌드는 계속 |
| `6_verify_output.mjs` | `npm run build` 뒤 자동 | 페이지 누락·깨진 이미지·sitemap 점검 | 경고만 남기고 종료 코드 0 |

## 새 앱을 추가할 때

`content/apps.json` 의 `apps` 배열에 항목을 추가한다.

| 필드 | 설명 |
|---|---|
| `slug` | URL 이 된다. 영어 소문자·숫자·하이픈만 (예: `bubble-shooter`). 중복 불가 |
| `published` | `true` 여야 사이트에 나온다 |
| `name` / `tagline` | `{ ko, en }`. 한국어는 필수, 영어가 비면 한국어가 대신 나간다 |
| `body` | `{ ko, en }` 상세 소개. 마크다운(`###`, `-`, `**`) 을 쓴다 |
| `kind` | `game` 또는 `app` — 목록 카테고리 필터가 이 값을 쓴다 |
| `status` | `released` / `wip` 등 |
| `platforms` / `tags` | 문자열 배열 |
| `storeUrl` / `privacyUrl` | 전체 URL |
| `releaseDate` | `YYYY-MM-DD` |
| `order` | 목록 정렬 순서 (작을수록 앞) |
| `icon` / `screenshots` | `/media/<슬러그>/...` 경로. 파일을 `public/media/<슬러그>/` 에 함께 넣는다 |

`_issues` 는 검사 스크립트가 채우는 칸이라 직접 쓰지 않아도 된다.

추가한 뒤 `npm run data` 로 검사하고, 오류 0건을 확인한 다음 push 한다.
