import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/admin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{
        background: '#1a1a1a', color: '#fff', padding: '0 32px', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="/" style={{
            fontFamily: "'Frank Ruhl Libre', serif", fontSize: '1.1rem', fontWeight: 700,
            color: '#fff', textDecoration: 'none',
          }}>
            שי לי <span style={{ color: '#c9a84c' }}>יודאיקה</span>
          </a>
          <span style={{ color: '#666', fontSize: '0.8rem' }}>|</span>
          <span style={{ color: '#c9a84c', fontSize: '0.85rem', fontWeight: 600 }}>פאנל ניהול</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="/admin" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.88rem' }}>מוצרים</a>
          <a href="/admin/categories" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.88rem' }}>קטגוריות</a>
          <a href="/" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.88rem' }}>← לחנות</a>
        </div>
      </div>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {children}
      </div>
    </div>
  )
}
