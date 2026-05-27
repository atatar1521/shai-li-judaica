import { Suspense } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import ShopClient from './ShopClient'

export const revalidate = 60

type Props = {
  searchParams: Promise<{ cat?: string }>
}

export default async function ShopPage({ searchParams }: Props) {
  const { cat } = await searchParams
  const supabase = await createClient()

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase.from('categories').select('name').order('display_order'),
  ])

  const categoryNames = categories?.map(c => c.name) ?? []
  const initialCategory = cat ? decodeURIComponent(cat) : null

  return (
    <>
      <Nav />
      <div className="shop-page">
        <div className="container">
          <div className="shop-header">
            <a href="/#categories" className="shop-back">→ כל הקטגוריות</a>
            <div className="section-header" style={{ textAlign: 'right', marginBottom: 0 }}>
              <div className="section-label">חנות</div>
              <h1 className="shop-title">כל המוצרים</h1>
              <p className="shop-desc">מגוון רחב של פריטי יודאיקה לכל צורך ואירוע</p>
            </div>
          </div>

          <Suspense>
            <ShopClient
              products={products ?? []}
              categories={categoryNames}
              initialCategory={initialCategory}
            />
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  )
}
