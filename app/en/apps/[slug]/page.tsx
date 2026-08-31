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
  if (!app) return { title: 'Not found' }
  return {
    title: pick(app.name, 'en'),
    description: pick(app.tagline, 'en'),
    openGraph: {
      title: pick(app.name, 'en'),
      description: pick(app.tagline, 'en'),
      images: app.icon ? [{ url: app.icon }] : undefined,
    },
    alternates: { languages: { ko: `/apps/${app.slug}/` } },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const app = getAppBySlug(slug)
  if (!app) notFound()
  return <AppDetail app={app} lang="en" />
}
