import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AppDetail from '@/components/AppDetail'
import { getAppBySlug, getPublishedApps, pick } from '@/lib/apps'

export function generateStaticParams() {
  return getPublishedApps().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const app = getAppBySlug(slug)
  if (!app) return { title: '없는 페이지' }
  return {
    title: pick(app.name, 'ko'),
    description: pick(app.tagline, 'ko'),
    openGraph: {
      title: pick(app.name, 'ko'),
      description: pick(app.tagline, 'ko'),
      images: app.icon ? [{ url: app.icon }] : undefined,
    },
    alternates: { languages: { en: `/en/apps/${app.slug}/` } },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const app = getAppBySlug(slug)
  if (!app) notFound()
  return <AppDetail app={app} lang="ko" />
}
