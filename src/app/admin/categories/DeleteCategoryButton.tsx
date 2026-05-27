'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`למחוק את הקטגוריה "${name}"?`)) return
    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', id)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      style={{
        background: '#fce4ec',
        color: '#c62828',
        border: 'none',
        padding: '6px 14px',
        borderRadius: '50px',
        fontSize: '0.82rem',
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'Heebo, sans-serif',
      }}
    >
      מחיקה
    </button>
  )
}
