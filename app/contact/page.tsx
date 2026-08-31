import type { Metadata } from 'next'
import ContactView from '@/components/ContactView'
export const metadata: Metadata = { title: '문의' }
export default function Page() {
  return <ContactView lang="ko" />
}
