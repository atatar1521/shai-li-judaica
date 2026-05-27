export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="logo">שי לי <span>יודאיקה</span></a>
            <p>פריטי יודאיקה מובחרים לכל אירוע ולכל בית. עם לב ועם מסורת.</p>
          </div>

          <div>
            <h4>ניווט</h4>
            <ul>
              <li><a href="#categories">קטגוריות</a></li>
              <li><a href="#products">מוצרים</a></li>
              <li><a href="#about">עלינו</a></li>
              <li><a href="#contact">צור קשר</a></li>
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
              <li><a href="tel:+972501234567">050-123-4567</a></li>
              <li><a href="mailto:Tair060215@gmail.com">Tair060215@gmail.com</a></li>
              <li><a href="#">WhatsApp</a></li>
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
