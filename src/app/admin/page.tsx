import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeleteProductButton from './DeleteProductButton'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: '1.8rem', fontWeight: 700 }}>
            ניהול מוצרים
          </h1>
          <p style={{ color: '#888', marginTop: '4px' }}>{products?.length ?? 0} מוצרים במאגר</p>
        </div>
        <Link href="/admin/products/new" style={{
          background: '#c9a84c',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '50px',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '0.9rem',
        }}>
          + הוסף מוצר
        </Link>
      </div>

      {/* Products Table */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #e8e4dc',
        overflow: 'hidden',
      }}>
        {!products || products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📦</p>
            <p>אין מוצרים עדיין</p>
            <Link href="/admin/products/new" style={{ color: '#c9a84c', fontWeight: 600, textDecoration: 'none' }}>
              הוסף את המוצר הראשון
            </Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafaf8', borderBottom: '1px solid #e8e4dc' }}>
                <th style={thStyle}>מוצר</th>
                <th style={thStyle}>קטגוריה</th>
                <th style={thStyle}>מחיר</th>
                <th style={thStyle}>סטטוס</th>
                <th style={thStyle}>תג</th>
                <th style={thStyle}>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} style={{
                  borderBottom: i < products.length - 1 ? '1px solid #e8e4dc' : 'none',
                }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</div>
                    {p.description && (
                      <div style={{ color: '#888', fontSize: '0.78rem', marginTop: '2px' }}>
                        {p.description.slice(0, 50)}{p.description.length > 50 ? '...' : ''}
                      </div>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: '#4a4a4a', fontSize: '0.88rem' }}>{p.category ?? '—'}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 700, color: '#1a1a1a' }}>₪{p.price}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      background: p.in_stock ? '#e8f5e9' : '#fce4ec',
                      color: p.in_stock ? '#2e7d32' : '#c62828',
                      padding: '3px 10px',
                      borderRadius: '50px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}>
                      {p.in_stock ? 'במלאי' : 'אזל'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {p.badge ? (
                      <span style={{
                        background: '#c9a84c', color: '#fff',
                        padding: '3px 10px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 600,
                      }}>{p.badge}</span>
                    ) : <span style={{ color: '#ccc' }}>—</span>}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/admin/products/edit?id=${p.id}`} style={{
                        background: '#f5f5f5', color: '#1a1a1a',
                        padding: '6px 14px', borderRadius: '50px',
                        textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600,
                      }}>עריכה</Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: '14px 20px',
  textAlign: 'right',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#888',
  letterSpacing: '0.05em',
}

const tdStyle: React.CSSProperties = {
  padding: '16px 20px',
  verticalAlign: 'middle',
}
