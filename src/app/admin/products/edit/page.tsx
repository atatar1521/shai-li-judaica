import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/ProductForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditProductPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  if (!id) notFound()

  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <Link href="/admin" style={{ color: '#888', textDecoration: 'none', fontSize: '0.88rem' }}>
          ← חזרה לרשימה
        </Link>
        <h1 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: '1.8rem', fontWeight: 700, marginTop: '8px' }}>
          עריכת מוצר
        </h1>
        <p style={{ color: '#888', marginTop: '4px' }}>{product.name}</p>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8e4dc', padding: '32px' }}>
        <ProductForm initial={{
          id: product.id,
          name: product.name,
          description: product.description ?? '',
          price: String(product.price),
          category: product.category ?? '',
          badge: product.badge ?? '',
          in_stock: product.in_stock,
          image_url: product.image_url ?? '',
        }} />
      </div>
    </div>
  )
}
