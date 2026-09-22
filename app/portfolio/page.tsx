import type { Metadata } from 'next'
import PortfolioView from '@/components/PortfolioView'

// 제출용 페이지. 주소를 아는 사람만 보게 검색엔진에는 싣지 않는다 (sitemap.ts 에도 넣지 않는다).
export const metadata: Metadata = {
  title: '차상민 — 포트폴리오',
  description: '게임 기획자 차상민 포트폴리오. 레벨 · 퀘스트 · 컨텐츠 기획, 10년 · 6개 프로젝트.',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <PortfolioView />
}
