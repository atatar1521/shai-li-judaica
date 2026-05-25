import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />

      <Hero />

      <TrustBar />

      {/* ═══ CATEGORIES ════════════════════════════════════════ */}
      <section className="section" id="categories">
        <div className="container">
          <div className="section-header">
            <div className="section-label">קטגוריות</div>
            <h2>מה תרצו למצוא?</h2>
            <p>מגוון רחב של פריטי יודאיקה לכל צורך ואירוע</p>
          </div>

          <div className="categories-grid">
            <a href="#" className="category-card">
              <span className="cat-icon">🕎</span>
              <h3>חנוכיות</h3>
              <p>חנוכיות מסורתיות ועיצוביות לכל טעם ותקציב</p>
            </a>
            <a href="#" className="category-card">
              <span className="cat-icon">📜</span>
              <h3>מזוזות</h3>
              <p>מזוזות כשרות בעיצובים מגוונים לכל דלת בביתכם</p>
            </a>
            <a href="#" className="category-card">
              <span className="cat-icon">🪬</span>
              <h3>תכשיטים</h3>
              <p>חמסות, שרשראות וצמידים עם סמלים יהודיים</p>
            </a>
            <a href="#" className="category-card">
              <span className="cat-icon">🕯️</span>
              <h3>שבת וחגים</h3>
              <p>מנורות שבת, גביעי קידוש, מכלי בשמים ועוד</p>
            </a>
            <a href="#" className="category-card">
              <span className="cat-icon">🖼️</span>
              <h3>אמנות לבית</h3>
              <p>תמונות, מפות ישראל ויצירות אמנות יהודית לבית</p>
            </a>
            <a href="#" className="category-card">
              <span className="cat-icon">🎁</span>
              <h3>מתנות מיוחדות</h3>
              <p>סטים מאורזים לבר מצווה, חתונה ואירועים מיוחדים</p>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS ══════════════════════════════════ */}
      <section className="section products-section" id="products">
        <div className="container">
          <div className="section-header">
            <div className="section-label">מוצרים</div>
            <h2>המוצרים הנבחרים שלנו</h2>
            <p>הפריטים הפופולריים ביותר בחנות</p>
          </div>

          <div className="products-grid">
            <div className="product-card">
              <div className="product-img">
                🕎
                <div className="product-badge">מבצע</div>
              </div>
              <div className="product-info">
                <h4>חנוכייה ירושלמית</h4>
                <p className="sub">כסף מצופה | גובה 22 ס״מ</p>
                <div className="product-price">₪ 189 <span>כולל מע&quot;מ</span></div>
              </div>
            </div>

            <div className="product-card">
              <div className="product-img">📜</div>
              <div className="product-info">
                <h4>מזוזה אמנותית</h4>
                <p className="sub">קרמיקה בצבעי שמיים</p>
                <div className="product-price">₪ 95 <span>כולל מע&quot;מ</span></div>
              </div>
            </div>

            <div className="product-card">
              <div className="product-img">
                🪬
                <div className="product-badge">חדש</div>
              </div>
              <div className="product-info">
                <h4>שרשרת חמסה זהב</h4>
                <p className="sub">ציפוי זהב 18K עם אבן</p>
                <div className="product-price">₪ 145 <span>כולל מע&quot;מ</span></div>
              </div>
            </div>

            <div className="product-card">
              <div className="product-img">🕯️</div>
              <div className="product-info">
                <h4>סט שבת מפואר</h4>
                <p className="sub">גביע קידוש + פמוטות כסף</p>
                <div className="product-price">₪ 320 <span>כולל מע&quot;מ</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ══════════════════════════════════════════════ */}
      <section className="section" id="about">
        <div className="container about-inner">
          <div className="about-visual">✡</div>

          <div className="about-content">
            <div className="section-label">עלינו</div>
            <h2>שנים של אהבה<br />למסורת היהודית</h2>
            <p>
              ב״שי לי יודאיקה״ אנחנו מאמינים שכל פריט יהודי הוא יותר מסתם חפץ — הוא חיבור
              לשורשים, לזיכרון ולזהות.
            </p>
            <p>
              אנחנו בוחרים בקפידה כל מוצר — בין אם הוא יצא מידי אומן ישראלי, בין אם הגיע
              מהמקורות הטובים ביותר בעולם. הכל כדי שתקבלו מתנה שתישמר לדורות.
            </p>

            <div className="about-stats">
              <div className="stat">
                <h3>+500</h3>
                <p>פריטים בקטלוג</p>
              </div>
              <div className="stat">
                <h3>+2K</h3>
                <p>לקוחות מרוצים</p>
              </div>
              <div className="stat">
                <h3>10+</h3>
                <p>שנות ניסיון</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═════════════════════════════════════════ */}
      <section className="cta-banner" id="contact">
        <h2>מחפשים מתנה מיוחדת?</h2>
        <p>צרו איתנו קשר ונמצא יחד את הפריט המושלם עבורכם</p>
        <a href="mailto:info@shailiyudaika.co.il" className="btn-gold">צרו קשר עכשיו</a>
      </section>

      <Footer />
    </>
  )
}
