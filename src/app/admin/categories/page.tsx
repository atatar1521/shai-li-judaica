import { createClient } from '@/lib/supabase/server'
import AddCategoryForm from './AddCategoryForm'
import DeleteCategoryButton from './DeleteCategoryButton'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: '1.8rem', fontWeight: 700, marginTop: '8px' }}>
          ניהול קטגוריות
        </h1>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8e4dc', padding: '32px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', fontFamily: 'Heebo, sans-serif' }}>
          הוספת קטגוריה חדשה
        </h2>
        <AddCategoryForm />
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8e4dc', overflow: 'hidden' }}>
        {categories && categories.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9f9f7', borderBottom: '1px solid #e8e4dc' }}>
                <th style={thStyle}>שם קטגוריה</th>
                <th style={thStyle}>תאריך יצירה</th>
                <th style={thStyle}>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} style={{ borderBottom: '1px solid #f0ede7' }}>
                  <td style={tdStyle}>{cat.name}</td>
                  <td style={tdStyle}>{new Date(cat.created_at).toLocaleDateString('he-IL')}</td>
                  <td style={tdStyle}>
                    <DeleteCategoryButton id={cat.id} name={cat.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <p style={{ fontSize: '2rem', marginBottom: '12px' }}>📂</p>
            <p>אין קטגוריות עדיין</p>
          </div>
        )}
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: '14px 20px', textAlign: 'right', fontSize: '0.82rem',
  fontWeight: 700, color: '#888', fontFamily: 'Heebo, sans-serif',
}

const tdStyle: React.CSSProperties = {
  padding: '14px 20px', textAlign: 'right', fontSize: '0.92rem',
  fontFamily: 'Heebo, sans-serif', color: '#333',
}
