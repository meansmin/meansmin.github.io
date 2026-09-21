'use client'

import { useRef } from 'react'

/** 포인터 위치로 카드를 살짝 기울인다. 터치 기기에서는 hover 가 없어 자연히 동작하지 않는다. */
export default function Tilt({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const max = 6 // 도(°). 크면 싸구려처럼 보인다.

  function move(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-py * max).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(px * max).toFixed(2)}deg`)
    el.style.setProperty('--gx', `${((px + 0.5) * 100).toFixed(1)}%`)
    el.style.setProperty('--gy', `${((py + 0.5) * 100).toFixed(1)}%`)
  }
  function leave() {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <div ref={ref} className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  )
}
