import type { Metadata } from 'next'
import HomeView from '@/components/HomeView'
export const metadata: Metadata = {
  title: 'C&C F. — Apps and games built alone',
  description: 'Android apps and games where one person handled the design, the code, the art, and the release.',
}
export default function Page() {
  return <HomeView lang="en" />
}
