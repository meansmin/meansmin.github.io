import type { Metadata } from 'next'
import ProductsView from '@/components/ProductsView'
export const metadata: Metadata = { title: '제품' }
export default function Page() {
  return <ProductsView lang="ko" />
}
