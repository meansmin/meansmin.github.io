'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 타임라인의 가로 스크롤 틀. 양끝에 화살표 버튼을 달고, 끝에 닿으면 그쪽 버튼과 흐림(mask)을 끈다.
 * 스크롤 자체는 네이티브(터치·트랙패드)라 JS 가 꺼져도 움직인다 — 버튼만 안 보일 뿐이다.
 */
export default function RailScroller({
  children,
  label,
  prevLabel,
  nextLabel,
}: {
  children: React.ReactNode
  label: string
  prevLabel: string
  nextLabel: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    setCanPrev(el.scrollLeft > 2)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 2)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [update])

  const go = (dir: -1 | 1) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.7), behavior: 'smooth' })
  }

  return (
    <div className="rail-shell">
      <div ref={ref} className="rail-wrap" data-prev={canPrev || undefined} data-next={canNext || undefined} aria-label={label}>
        {children}
      </div>
      <button type="button" className="rail-btn rail-btn-prev" onClick={() => go(-1)} aria-label={prevLabel} hidden={!canPrev}>
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden><path d="M12.5 4 6.5 10l6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button type="button" className="rail-btn rail-btn-next" onClick={() => go(1)} aria-label={nextLabel} hidden={!canNext}>
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden><path d="m7.5 4 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  )
}
