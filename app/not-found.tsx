import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="wrap flex min-h-[75vh] flex-col items-center justify-center gap-6 text-center">
      <div className="font-[family-name:var(--font-mono)] text-5xl font-medium text-[var(--color-brand)]">404</div>
      <p className="text-lg font-semibold">찾는 페이지가 없습니다</p>
      <Link
        href="/"
        className="rounded-xl bg-[var(--color-brand)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-dark)]"
      >
        홈으로
      </Link>
    </main>
  )
}
