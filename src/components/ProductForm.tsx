'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type ProductData = {
  id?: string
  name: string
  description: string
  price: string
  category: string
  badge: string
  in_stock: boolean
  image_url: string
}

const CATEGORIES = ['חנוכיות', 'מזוזות', 'תכשיטים', 'שבת וחגים', 'אמנות לבית', 'מתנות']

export default function ProductForm({ initial }: { initial?: Partial<ProductData> }) {
  const router = useRouter()
  const supabase = createClient()
  const isEdit = !!initial?.id

  const [form, setForm] = useState<ProductData>({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    price: initial?.price ?? '',
    category: initial?.category ?? '',
    badge: initial?.badge ?? '',
    in_stock: initial?.in_stock ?? true,
    image_url: initial?.image_url ?? '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key: keyof ProductData, value: string | boolean) =>
    setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      category: form.category || null,
      badge: form.badge || null,
      in_stock: form.in_stock,
      image_url: form.image_url || null,
    }

    if (isEdit) {
      const { error } = await supabase.from('products').update(payload).eq('id', initial!.id!)
      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { error } = await supabase.from('products').insert(payload)
      if (error) { setError(error.message); setLoading(false); return }
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Name */}
        <div>
          <label style={labelStyle}>שם המוצר *</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="למשל: חנוכייה ירושלמית" style={inputStyle} />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>תיאור</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="תיאור קצר של המוצר..." rows={3}
            style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        {/* Price + Category */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>מחיר (₪) *</label>
            <input required type="number" min="0" step="0.01"
              value={form.price} onChange={e => set('price', e.target.value)}
              placeholder="189" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>קטגוריה</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} style={inputStyle}>
              <option value="">בחרו קטגוריה</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Badge + In Stock */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>תג (אופציונלי)</label>
            <input value={form.badge} onChange={e => set('badge', e.target.value)}
              placeholder="למשל: חדש, מבצע" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>סטטוס מלאי</label>
            <select value={form.in_stock ? 'true' : 'false'}
              onChange={e => set('in_stock', e.target.value === 'true')} style={inputStyle}>
              <option value="true">במלאי</option>
              <option value="false">אזל מהמלאי</option>
            </select>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label style={labelStyle}>קישור לתמונה (URL)</label>
          <input value={form.image_url} onChange={e => set('image_url', e.target.value)}
            placeholder="https://..." style={inputStyle} />
          {form.image_url && (
            <div style={{ marginTop: '8px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.image_url} alt="preview"
                style={{ height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e8e4dc' }} />
            </div>
          )}
        </div>

        {error && <p style={{ color: '#c62828', fontSize: '0.88rem' }}>{error}</p>}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
          <button type="submit" disabled={loading} style={{
            background: loading ? '#888' : '#c9a84c',
            color: '#fff', border: 'none',
            padding: '13px 32px', borderRadius: '50px',
            fontSize: '1rem', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Heebo, sans-serif',
          }}>
            {loading ? '...' : isEdit ? 'שמור שינויים' : 'הוסף מוצר'}
          </button>
          <button type="button" onClick={() => router.back()} style={{
            background: 'none', border: '1px solid #e8e4dc',
            padding: '13px 24px', borderRadius: '50px',
            fontSize: '0.95rem', cursor: 'pointer',
            fontFamily: 'Heebo, sans-serif', color: '#4a4a4a',
          }}>
            ביטול
          </button>
        </div>
      </div>
    </form>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.85rem', fontWeight: 600,
  color: '#4a4a4a', marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  border: '1px solid #e8e4dc', borderRadius: '10px',
  fontSize: '0.95rem', outline: 'none',
  fontFamily: 'Heebo, sans-serif', textAlign: 'right',
  background: '#fff',
}
