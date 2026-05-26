'use client'

import { useRef, useState } from 'react'
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
  const fileInputRef = useRef<HTMLInputElement>(null)

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
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)

  const set = (key: keyof ProductData, value: string | boolean) =>
    setForm(f => ({ ...f, [key]: value }))

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('יש לבחור קובץ תמונה בלבד')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('גודל הקובץ המקסימלי הוא 5MB')
      return
    }

    setUploading(true)
    setUploadError('')

    const body = new FormData()
    body.append('file', file)

    const res = await fetch('/api/upload-image', { method: 'POST', body })
    const json = await res.json()

    if (!res.ok) {
      setUploadError('שגיאה בהעלאה: ' + json.error)
      setUploading(false)
      return
    }

    set('image_url', json.url)
    setUploading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

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

        {/* Image upload */}
        <div>
          <label style={labelStyle}>תמונת המוצר</label>

          {/* Drop zone */}
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragOver ? '#c9a84c' : '#e8e4dc'}`,
              borderRadius: '12px',
              padding: '24px 16px',
              textAlign: 'center',
              cursor: uploading ? 'default' : 'pointer',
              background: dragOver ? 'rgba(201,168,76,0.06)' : '#fafaf8',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {form.image_url ? (
              /* Preview */
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image_url}
                  alt="preview"
                  style={{ height: '140px', maxWidth: '100%', borderRadius: '8px', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); set('image_url', '') }}
                  style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    background: '#fff', border: '1px solid #e8e4dc',
                    borderRadius: '50%', width: '26px', height: '26px',
                    fontSize: '0.85rem', cursor: 'pointer', lineHeight: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                  }}
                >×</button>
                <p style={{ marginTop: '10px', fontSize: '0.78rem', color: '#aaa' }}>
                  לחצו או גררו תמונה חדשה להחלפה
                </p>
              </div>
            ) : uploading ? (
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⏳</div>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>מעלה תמונה...</p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📁</div>
                <p style={{ fontWeight: 600, color: '#333', marginBottom: '4px' }}>
                  גררו תמונה לכאן
                </p>
                <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '12px' }}>
                  או לחצו לבחירת קובץ מהמכשיר
                </p>
                <span style={{
                  display: 'inline-block',
                  background: '#111', color: '#fff',
                  padding: '8px 20px', borderRadius: '50px',
                  fontSize: '0.85rem', fontWeight: 600,
                }}>
                  בחרו קובץ
                </span>
                <p style={{ marginTop: '10px', fontSize: '0.75rem', color: '#bbb' }}>
                  JPG, PNG, WEBP — עד 5MB
                </p>
              </div>
            )}
          </div>

          {/* Hidden file input — accepts images, opens gallery/camera on mobile */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {uploadError && (
            <p style={{ color: '#c62828', fontSize: '0.82rem', marginTop: '6px' }}>{uploadError}</p>
          )}

          {/* URL fallback toggle */}
          <button
            type="button"
            onClick={() => setShowUrlInput(v => !v)}
            style={{
              marginTop: '10px',
              background: 'none', border: 'none',
              color: '#c9a84c', fontSize: '0.82rem',
              cursor: 'pointer', textDecoration: 'underline',
              fontFamily: 'Heebo, sans-serif', padding: 0,
            }}
          >
            {showUrlInput ? 'הסתר' : 'או הזינו קישור URL לתמונה'}
          </button>

          {showUrlInput && (
            <input
              value={form.image_url}
              onChange={e => set('image_url', e.target.value)}
              placeholder="https://..."
              style={{ ...inputStyle, marginTop: '8px' }}
            />
          )}
        </div>

        {error && <p style={{ color: '#c62828', fontSize: '0.88rem' }}>{error}</p>}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
          <button type="submit" disabled={loading || uploading} style={{
            background: (loading || uploading) ? '#888' : '#c9a84c',
            color: '#fff', border: 'none',
            padding: '13px 32px', borderRadius: '50px',
            fontSize: '1rem', fontWeight: 700,
            cursor: (loading || uploading) ? 'not-allowed' : 'pointer',
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
