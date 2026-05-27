import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/ProductForm'
import Link from 'next/link'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: cats } = await supabase.from('categories').select('name').order('display_order')
  const categories = cats?.map(c => c.name) ?? []

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <Link href="/admin" style={{ color: '#888', textDecoration: 'none', fontSize: '0.88rem' }}>
          ← חזרה לרשימה
        </Link>
        <h1 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: '1.8rem', fontWeight: 700, marginTop: '8px' }}>
          הוספת מוצר חדש
        </h1>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8e4dc', padding: '32px' }}>
        <ProductForm categories={categories} />
      </div>
    </div>
  )
}
