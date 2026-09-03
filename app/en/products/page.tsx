import type { Metadata } from 'next'
import ProductsView from '@/components/ProductsView'
export const metadata: Metadata = { title: 'Products' }
export default function Page() {
  return <ProductsView lang="en" />
}
