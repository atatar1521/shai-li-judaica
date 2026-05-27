'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AddCategoryForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: insertError } = await supabase.from('categories').insert({ name })
    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }
    setName('')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <input
        required
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="שם הקטגוריה בעברית"
        style={inputStyle}
      />
      <button type="submit" disabled={loading} style={btnStyle}>
        {loading ? '...' : 'הוסף קטגוריה'}
      </button>
      {error && (
        <p style={{ color: '#c62828', fontSize: '0.82rem', alignSelf: 'center', margin: 0 }}>{error}</p>
      )}
    </form>
  )
}

const inputStyle: React.CSSProperties = {
  flex: 1, minWidth: '200px', padding: '11px 14px',
  border: '1px solid #e8e4dc', borderRadius: '10px',
  fontSize: '0.95rem', outline: 'none',
  fontFamily: 'Heebo, sans-serif', textAlign: 'right',
  background: '#fff',
}

const btnStyle: React.CSSProperties = {
  background: '#c9a84c', color: '#fff', border: 'none',
  padding: '11px 24px', borderRadius: '50px',
  fontSize: '0.9rem', fontWeight: 700,
  cursor: 'pointer', fontFamily: 'Heebo, sans-serif',
  whiteSpace: 'nowrap',
}
