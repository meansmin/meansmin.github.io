'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * 히어로 배경 영상. 포스터는 항상 그리고, 영상은 아래 조건을 전부 만족할 때만 붙인다.
 *  - 화면 폭 768px 이상 (모바일은 데이터·배터리 때문에 정지 화면 + CSS 애니메이션만)
 *  - 사용자가 모션 줄이기를 켜지 않았음
 *  - 브라우저가 데이터 절약 모드가 아님
 * 영상이 없거나 자동재생이 막혀도 포스터가 그대로 남으므로 깨지지 않는다.
 */
export default function HeroVideo({ poster, webm, mp4 }: { poster: string; webm: string; mp4: string }) {
  const [on, setOn] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)').matches
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (wide && !still && !saveData) setOn(true)
  }, [])

  useEffect(() => {
    if (on) ref.current?.play().catch(() => {})
  }, [on])

  return (
    <div aria-hidden className="hero-media">
      {/* 포스터를 img 로 따로 깔아 두면 영상이 로드되기 전에도 첫 화면이 비지 않는다 */}
      <img src={poster} alt="" className="hero-poster" decoding="async" fetchPriority="high" />
      {on && (
        <video ref={ref} className="hero-video" muted loop playsInline autoPlay preload="auto" poster={poster}>
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
      )}
      <div className="hero-veil" />
    </div>
  )
}
