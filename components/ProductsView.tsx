import type { Lang } from '@/lib/types'
import { getPublishedApps } from '@/lib/apps'
import { t } from '@/lib/i18n'
import Header from './Header'
import Footer from './Footer'
import ProductList from './ProductList'

export default function ProductsView({ lang }: { lang: Lang }) {
  const apps = getPublishedApps()
  return (
    <>
      <Header lang={lang} here="/products" />
      <main>
        <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-16 sm:py-20">
          <div className="wrap">
            <p className="eyebrow">{t('productsEyebrow', lang)}</p>
            <h1 className="mt-3 text-[2.1rem] font-bold tracking-[-0.03em] sm:text-[2.7rem]">
              {t('productsTitle', lang)}
            </h1>
            <p className="mt-4 max-w-xl text-[1.02rem] text-[var(--color-ink-2)]">
              {t('productsBody', lang)}
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-14">
          <div className="wrap">
            <ProductList apps={apps} lang={lang} />
          </div>
        </section>
      </main>
      <Footer lang={lang} apps={apps} />
    </>
  )
}
