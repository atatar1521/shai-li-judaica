function formatPhone(raw: string | undefined): string {
  if (!raw) return ''
  const local = raw.startsWith('972') ? '0' + raw.slice(3) : raw
  return local.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
}

export default function Footer() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE
  const waLink = `https://wa.me/+${phone}`
  const telLink = `tel:+${phone}`
  const displayPhone = formatPhone(phone)

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="/" className="logo">שי לי <span>יודאיקה</span></a>
            <p>פריטי יודאיקה מובחרים לכל אירוע ולכל בית. עם לב ועם מסורת.</p>
          </div>

          <div>
            <h4>ניווט</h4>
            <ul>
              <li><a href="/#categories">קטגוריות</a></li>
              <li><a href="/#products">מוצרים</a></li>
              <li><a href="/#about">עלינו</a></li>
              <li><a href="/#contact">צור קשר</a></li>
            </ul>
          </div>

          <div>
            <h4>שירות לקוחות</h4>
            <ul>
              <li><a href="#">משלוחים והחזרות</a></li>
              <li><a href="#">שאלות נפוצות</a></li>
              <li><a href="#">מדיניות פרטיות</a></li>
              <li><a href="#">תנאי שימוש</a></li>
            </ul>
          </div>

          <div>
            <h4>צרו קשר</h4>
            <ul>
              {displayPhone && (
                <li><a href={telLink}>{displayPhone}</a></li>
              )}
              <li><a href="mailto:Tair060215@gmail.com">Tair060215@gmail.com</a></li>
              <li><a href={waLink} target="_blank" rel="noreferrer">WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2025 שי לי יודאיקה. כל הזכויות שמורות.</span>
          <span>עוצב ופותח עם ❤️</span>
        </div>
      </div>
    </footer>
  )
}
