export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Admin Top Bar */}
      <div style={{
        background: '#1a1a1a',
        color: '#fff',
        padding: '0 32px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="/" style={{
            fontFamily: "'Frank Ruhl Libre', serif",
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#fff',
            textDecoration: 'none',
          }}>
            שי לי <span style={{ color: '#c9a84c' }}>יודאיקה</span>
          </a>
          <span style={{ color: '#666', fontSize: '0.8rem' }}>|</span>
          <span style={{ color: '#c9a84c', fontSize: '0.85rem', fontWeight: 600 }}>פאנל ניהול</span>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="/admin" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.88rem' }}>מוצרים</a>
          <a href="/" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.88rem' }}>← לחנות</a>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {children}
      </div>
    </div>
  )
}
