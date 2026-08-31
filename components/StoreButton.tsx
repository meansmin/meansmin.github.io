import type { Lang } from '@/lib/types'
import { t } from '@/lib/i18n'

export default function StoreButton({
  url,
  lang,
  size = 'md',
}: {
  url: string
  lang: Lang
  size?: 'md' | 'lg'
}) {
  if (!url) return null
  const pad = size === 'lg' ? 'px-6 py-3.5 text-[0.95rem]' : 'px-5 py-3 text-sm'
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 rounded-xl bg-[var(--color-brand)] ${pad} font-semibold text-white shadow-[0_4px_14px_rgba(43,91,215,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-brand-dark)] hover:shadow-[0_8px_22px_rgba(43,91,215,0.32)]`}
    >
      <svg width="16" height="18" viewBox="0 0 20 22" fill="none" aria-hidden>
        <path d="M1.5 1 12 11 1.5 21a1.6 1.6 0 0 1-.5-1.2V2.2c0-.5.2-.9.5-1.2Z" fill="currentColor" opacity=".95" />
        <path d="m14.6 8.6 3.3 1.9c.8.5.8 1.5 0 2l-3.3 1.9L11.8 11l2.8-2.4Z" fill="currentColor" opacity=".7" />
        <path d="M1.5 1c.4-.3 1-.4 1.5-.1l11.6 6.6-2.6 2.5L1.5 1Z" fill="currentColor" opacity=".55" />
        <path d="m12 12.5 2.6 2.5L3 21.6c-.5.3-1.1.2-1.5-.1L12 12.5Z" fill="currentColor" opacity=".85" />
      </svg>
      {t('openStore', lang)}
    </a>
  )
}
