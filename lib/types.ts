export type Lang = 'ko' | 'en'

export interface AppItem {
  slug: string
  published: boolean
  name: { ko: string; en: string }
  tagline: { ko: string; en: string }
  body: { ko: string; en: string }
  kind: 'game' | 'app'
  status: 'released' | 'developing' | 'planning' | 'paused'
  platforms: string[]
  tags: string[]
  storeUrl: string
  privacyUrl: string
  releaseDate: string
  order: number
  icon: string
  screenshots: string[]
}

export interface AppsFile {
  generatedAt: string
  source: string
  apps: AppItem[]
}
