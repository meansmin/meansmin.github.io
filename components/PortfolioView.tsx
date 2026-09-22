import Link from 'next/link'
import { getCareer } from '@/lib/career'
import { getPublishedApps } from '@/lib/apps'
import { SITE } from '@/lib/i18n'
import Footer from './Footer'
import Reveal from './Reveal'

/**
 * /portfolio/ — 제출용 포트폴리오. 메뉴·푸터·사이트맵에 넣지 않고 주소로만 연다.
 * 원본은 content/career.json. 한국어 전용이라 언어 전환 없는 슬림 상단바를 쓴다.
 */
/** [a,b,c,d,e] → [c 앞쪽 가운데] : 최근작(첫 항목)을 가운데에, 나머지를 양옆에 번갈아 놓는다 */
function fanOrder(keys: string[]): string[] {
  const out: string[] = [keys[0]]
  keys.slice(1).forEach((k, i) => (i % 2 === 0 ? out.unshift(k) : out.push(k)))
  return out
}

export default function PortfolioView() {
  const c = getCareer()
  const p = c.person
  const projectCount = Object.keys(c.projects).length
  const engines = new Set(Object.values(c.projects).map((x) => x.engine.split(' ')[0]))
  const years = { from: c.companies[c.companies.length - 1].from.slice(0, 4), to: c.companies[0].to.slice(0, 4) }

  const stats = [
    { n: p.totalCareer.replace('약 ', ''), label: `총 경력 (${p.totalCareerExact})` },
    { n: `${c.companies.length}`, label: '회사' },
    { n: `${projectCount}`, label: '프로젝트' },
    { n: `${engines.size}`, label: '엔진 · ' + [...engines].join(' / ') },
  ]

  return (
    <>
      <header className="pf-top no-print">
        <div className="wrap flex h-16 items-center justify-between gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-brand)] text-[13px] font-bold text-white">
              C
            </span>
            <span className="text-[1.02rem] font-bold tracking-tight">{SITE.brand}</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm sm:gap-2">
            <span className="eyebrow hidden sm:inline">PORTFOLIO</span>
            <a href="#career" className="pf-nav pf-nav-sm">경력</a>
            <a href="#projects" className="pf-nav pf-nav-sm">프로젝트</a>
            <a href="#ability" className="pf-nav pf-nav-sm">강점</a>
            <a href="#contact" className="pf-nav pf-nav-strong">연락</a>
          </nav>
        </div>
      </header>

      <main className="pf">
        {/* ── 히어로 ─────────────────────────────────────────── */}
        <section className="pf-hero">
          <div className="wrap grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <p className="eyebrow rise">
                PORTFOLIO · {p.title} · <span className="font-[family-name:var(--font-display)]">{years.from} — {years.to}</span>
              </p>
              <h1 className="pf-name rise" style={{ animationDelay: '80ms' }}>
                {p.name}
                <span className="pf-name-en">{p.nameEn}</span>
              </h1>
              <p className="pf-focus rise" style={{ animationDelay: '140ms' }}>
                {p.focus}
              </p>
              <p className="hero-lead rise" style={{ animationDelay: '200ms' }}>
                {p.summary}
              </p>
              <ul className="pf-stats rise" style={{ animationDelay: '280ms' }}>
                {stats.map((s) => (
                  <li key={s.label}>
                    <span className="num">{s.n}</span>
                    <span className="pf-stat-label">{s.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 다섯 작품의 키아트를 부채처럼 겹친다. 이 페이지에서 가장 먼저 눈에 들어오는 것 */}
            <div className="pf-fan rise" style={{ animationDelay: '360ms' }} aria-hidden>
              {/* 가운데(앞)에 최근작이 오도록 순서를 바꾼다: 좌 2 · 중앙 1 · 우 2 */}
              {fanOrder(Object.keys(c.projects)).map((key, i) => (
                (([k, pr]) => (
                <a key={k} href={`#proj-${k}`} className="pf-fan-card" style={{ ['--i' as string]: i }}>
                  <img src={pr.keyArt} alt="" loading={i === 2 ? 'eager' : 'lazy'} />
                  <span className="pf-fan-label">{pr.name}</span>
                </a>
                ))([key, c.projects[key]] as const)
              ))}
            </div>
          </div>
        </section>

        {/* ── 경력 ───────────────────────────────────────────── */}
        <section id="career" className="scroll-mt-20 py-20 sm:py-24">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">CAREER</p>
              <h2 className="h2">경력 사항</h2>
              <p className="lead">최근 회사가 위. 회사마다 맡았던 프로젝트로 바로 갈 수 있습니다.</p>
            </Reveal>
            <ol className="crail mt-12">
              {c.companies.map((co, i) => (
                <li key={co.name} className="crail-row">
                  <Reveal delay={i * 80}>
                    <div className="crail-inner">
                      <div className="crail-when">
                        <span className="crail-year">{co.from}</span>
                        <span className="crail-arrow">→</span>
                        <span className="crail-year">{co.to}</span>
                        <span className="crail-len">{co.length}</span>
                      </div>
                      <div className="crail-body">
                        <h3 className="crail-co">
                          {co.name}
                          {co.sub && <span className="crail-sub">{co.sub}</span>}
                        </h3>
                        <p className="crail-role">{co.role}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {co.projects.map((k) => (
                            <a key={k} href={`#proj-${k}`} className="pf-chip">
                              {c.projects[k].name}
                              <span className="pf-chip-engine">{c.projects[k].engine.split(' ')[0]}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── 프로젝트 ───────────────────────────────────────── */}
        <section id="projects" className="scroll-mt-20 border-t border-[var(--color-line)] bg-[var(--color-surface)] py-20 sm:py-24">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">PROJECTS</p>
              <h2 className="h2">프로젝트</h2>
              <p className="lead">무엇을 맡았고, 무엇을 만들었는지. 성과가 있는 항목은 따로 표시했습니다.</p>
            </Reveal>

            <div className="mt-12 flex flex-col gap-16 sm:gap-24">
              {c.companies.flatMap((co) => co.projects).map((key, idx) => {
                const pr = c.projects[key]
                return (
                  <article key={key} id={`proj-${key}`} className="proj scroll-mt-24">
                    <Reveal>
                      <div className="proj-banner">
                        <img src={pr.keyArt} alt="" loading="lazy" />
                        <div className="proj-banner-veil" />
                        <div className="proj-banner-text">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="pf-badge">{pr.engine}</span>
                            <span className="pf-badge pf-badge-soft">{pr.genre}</span>
                            <span className="pf-badge pf-badge-soft">{pr.status}</span>
                          </div>
                          <h3 className="proj-title">
                            <span className="proj-index">{String(idx + 1).padStart(2, '0')}</span>
                            {pr.name}
                          </h3>
                        </div>
                      </div>
                    </Reveal>

                    <div className="proj-body">
                      <Reveal>
                        <dl className="proj-meta">
                          <div>
                            <dt>기간</dt>
                            <dd className="font-[family-name:var(--font-display)]">
                              {pr.from} — {pr.to}
                            </dd>
                          </div>
                          <div>
                            <dt>직무</dt>
                            <dd>{pr.position}</dd>
                          </div>
                          <div>
                            <dt>회사</dt>
                            <dd>{c.companies.find((co) => co.projects.includes(key))?.name}</dd>
                          </div>
                        </dl>
                        <p className="proj-intro">{pr.intro}</p>
                      </Reveal>

                      <Reveal delay={60}>
                        <div className="proj-high">
                          <p className="eyebrow">성과 · 핵심</p>
                          <ul>
                            {pr.highlights.map((h) => (
                              <li key={h}>{h}</li>
                            ))}
                          </ul>
                        </div>
                      </Reveal>

                      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                        <Reveal delay={90}>
                          <h4 className="proj-h4">담당 업무</h4>
                          <ul className="proj-list">
                            {pr.duties.map((d) => (
                              <li key={d}>{d}</li>
                            ))}
                          </ul>
                        </Reveal>
                        <Reveal delay={120}>
                          <h4 className="proj-h4">기획 상세</h4>
                          <div className="flex flex-col gap-2">
                            {pr.sections.map((s, i) => (
                              <details key={s.title} name={`sec-${key}`} className="proj-sec" open={i === 0}>
                                <summary>{s.title}</summary>
                                <ul className="proj-list">
                                  {s.items.map((it) => (
                                    <li key={it}>{it}</li>
                                  ))}
                                </ul>
                              </details>
                            ))}
                          </div>
                        </Reveal>
                      </div>

                      {pr.shots.length > 0 && (
                        <Reveal delay={60}>
                          <h4 className="proj-h4">인게임</h4>
                          <ul className="proj-shots">
                            {pr.shots.map((s, i) => (
                              <li key={s}>
                                <a href={s} target="_blank" rel="noopener">
                                  <img src={s} alt={`${pr.name} 화면 ${i + 1}`} loading="lazy" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </Reveal>
                      )}

                      {pr.docs.length > 0 && (
                        <Reveal delay={60}>
                          <h4 className="proj-h4">기획 문서</h4>
                          <ul className="proj-docs">
                            {pr.docs.map((s, i) => (
                              <li key={s}>
                                <a href={s} target="_blank" rel="noopener">
                                  <img src={s} alt={`${pr.name} 기획 문서 ${i + 1}`} loading="lazy" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </Reveal>
                      )}

                      {pr.video && (
                        <a href={pr.video.url} target="_blank" rel="noopener" className="btn-ghost inline-flex items-center gap-2 self-start">
                          <span aria-hidden>▶</span> {pr.video.label}
                        </a>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── 강점 · 툴 ──────────────────────────────────────── */}
        <section id="ability" className="scroll-mt-20 py-20 sm:py-24">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">ABILITY</p>
              <h2 className="h2">일하는 방식</h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {c.abilities.map((a, i) => (
                <Reveal key={a.title} delay={i * 90}>
                  <div className="about-card">
                    <h3 className="text-[1.05rem] font-bold tracking-tight">{a.title}</h3>
                    <p className="mt-2.5 text-[0.92rem] leading-relaxed text-[var(--color-ink-2)]">{a.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <p className="eyebrow mt-20">TOOLS & SKILLS</p>
              <h2 className="h2">다루는 도구</h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {c.tools.map((t, i) => (
                <Reveal key={t.name} delay={i * 80}>
                  <div className="glass next-card">
                    <h3 className="text-[1.1rem] font-bold tracking-tight">{t.name}</h3>
                    <p className="font-[family-name:var(--font-display)] text-[0.72rem] tracking-[0.14em] text-[var(--color-muted)]">{t.sub}</p>
                    <ul className="proj-list mt-4 text-[0.88rem]">
                      {t.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 연락 ───────────────────────────────────────────── */}
        <section id="contact" className="scroll-mt-20 pb-20 sm:pb-24">
          <div className="wrap">
            <Reveal>
              <div className="cta-band">
                <p className="font-[family-name:var(--font-display)] text-[0.78rem] tracking-[0.16em] text-white/70">CONTACT</p>
                <h2 className="mt-2 text-[1.7rem] font-bold tracking-[-0.02em] text-white sm:text-[2.1rem]">{p.name}</h2>
                <p className="mx-auto mt-2 max-w-lg text-[0.98rem] text-white/85">
                  {p.title} · {p.focus}
                </p>
                <div className="mt-8 flex justify-center">
                  <a href={`mailto:${p.email}`} className="btn-on-dark font-[family-name:var(--font-mono)]">
                    {p.email}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer lang="ko" apps={getPublishedApps()} />
    </>
  )
}
