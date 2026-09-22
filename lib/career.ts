import fs from 'node:fs'
import path from 'node:path'

export interface Project {
  name: string
  engine: string
  genre: string
  status: string
  from: string
  to: string
  position: string
  intro: string
  highlights: string[]
  duties: string[]
  sections: { title: string; items: string[] }[]
  video?: { label: string; url: string }
  keyArt: string
  shots: string[]
  docs: string[]
}
export interface Company {
  name: string
  sub?: string
  from: string
  to: string
  length: string
  role: string
  projects: string[]
}
export interface Career {
  person: {
    name: string
    nameEn: string
    title: string
    focus: string
    totalCareer: string
    totalCareerExact: string
    email: string
    summary: string
  }
  companies: Company[]
  projects: Record<string, Project>
  abilities: { title: string; body: string }[]
  tools: { name: string; sub: string; items: string[] }[]
}

/** content/career.json — 포트폴리오 페이지 원본. 빌드 시점에만 읽는다. */
export function getCareer(): Career {
  const file = path.join(process.cwd(), 'content', 'career.json')
  return JSON.parse(fs.readFileSync(file, 'utf8')) as Career
}
