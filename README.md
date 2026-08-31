# C&C F. 홈페이지

앱·게임 소개 홈페이지. **노션에서 내용을 관리**하고, 정적 사이트로 빌드해 **GitHub Pages**에 배포한다.

- 공개 주소: https://meansmin.github.io (배포 완료 · 2026-08-31)
- 관리자 페이지(노션): `C&C F. 홈페이지 관리` → `앱 & 게임` 데이터베이스
- 저장소: https://github.com/meansmin/meansmin.github.io

> ⚠ **`public/app-ads.txt` 는 지우면 안 됩니다.**
> AdMob 퍼블리셔 인증 파일이라 `https://meansmin.github.io/app-ads.txt` 주소가 살아 있어야
> 앱의 광고 수익 인증이 유지됩니다. 이 파일은 빌드할 때 사이트 최상단으로 복사됩니다.

---

## 어떻게 돌아가나

```
노션 「앱 & 게임」 DB  ──(GitHub Actions)──▶  정적 HTML  ──▶  GitHub Pages
   상민님이 쓰는 곳                빌드 1~3분              방문자가 보는 곳
```

1. 노션에서 카드를 추가하거나 고친다
2. **공개** 체크박스를 켠다
3. GitHub → Actions → `사이트 빌드 및 배포` → **Run workflow** 를 누른다
   (누르지 않아도 매일 오전 6시에 자동으로 한 번 돈다)
4. 1~3분 뒤 사이트에 반영된다

## 처음 한 번만 해야 하는 설정

### 1) 노션 연동 토큰

1. https://www.notion.so/my-integrations 에서 **New integration** 을 만든다 (Internal)
2. 발급된 `ntn_...` 토큰을 복사한다
3. 노션에서 `C&C F. 홈페이지 관리` 페이지 → 우측 상단 `···` → **Connections** → 만든 통합을 연결한다
4. GitHub 저장소 → Settings → Secrets and variables → Actions → **New repository secret**
   - `NOTION_TOKEN` = 복사한 토큰
   - `NOTION_DATA_SOURCE_ID` = `96f32fcf-faa5-437c-a941-40dbba4a6f92`

토큰을 넣지 않아도 사이트는 저장소에 들어 있는 `content/apps.json` 으로 정상 빌드된다.

### 2) 문의 폼 (선택)

1. https://formspree.io 에서 무료 가입 후 폼을 만든다 (무료 플랜 월 50건)
2. 발급된 폼 ID(`abcdwxyz` 형태)를 GitHub → Settings → Secrets and variables → Actions →
   **Variables** 탭 → `FORMSPREE_ID` 로 등록한다

등록하지 않으면 문의 페이지에 메일 주소만 표시된다.

### 3) GitHub Pages — 설정 완료

저장소 Settings → Pages 의 Source 는 이미 **GitHub Actions** 로 맞춰져 있습니다. 다시 만질 일은 없습니다.

---

## 로컬에서 돌려보기

```bash
npm install
npm run data      # 노션에서 받아 검사하고 이미지까지 정리 (토큰 없으면 기존 데이터 사용)
npm run dev       # http://localhost:3000
npm run build     # 정적 빌드 → out/
```

## 폴더 구조

| 경로 | 설명 |
|---|---|
| `scripts/` | 데이터 파이프라인. 기능별로 나뉘어 있어 하나가 실패해도 나머지가 돈다 |
| `content/apps.json` | 사이트가 실제로 읽는 앱 데이터 (파이프라인 산출물이자 폴백 원본) |
| `public/media/<슬러그>/` | 아이콘·스크린샷. 노션에 파일을 안 올렸을 때 여기 있는 파일을 쓴다 |
| `app/` | 페이지 (한국어는 `/`, 영어는 `/en`) |
| `components/` | 화면 구성요소 |
| `lib/` | 데이터 로더, 다국어 문구, 마크다운 렌더러 |

## 파이프라인 단계

| 스크립트 | 하는 일 | 실패하면 |
|---|---|---|
| `1_fetch_notion.mjs` | 노션 API 호출 → `.cache/notion-raw.json` | 직전 캐시로 계속 |
| `2_normalize.mjs` | 원본 → `content/apps.json` | 기존 파일 유지 |
| `3_validate.mjs` | 슬러그·링크·필수값 검사 | 문제 항목만 비공개 처리 |
| `4_download_media.mjs` | 노션 이미지 저장 (주소가 1시간이면 만료되므로 필수) | 기존 이미지 유지 |
| `6_verify_output.mjs` | 빌드 결과 점검 (postbuild 자동 실행) | 경고만 남김 |

## 새 앱을 추가할 때

노션 DB에 항목을 만들고 아래를 채운다.

- **슬러그** — URL 이 된다. 영어 소문자·숫자·하이픈만 (예: `bubble-shooter`)
- **이름 / 한 줄 소개** — 한국어는 필수, 영어가 비면 한국어가 대신 나간다
- **공개** — 켜야 사이트에 나온다
- **아이콘 / 스크린샷** — 노션에 드래그해 올리면 빌드 때 내려받아 저장한다
- 페이지 본문에 상세 소개를 쓰고, 영어는 `## EN` 아래에 쓴다
