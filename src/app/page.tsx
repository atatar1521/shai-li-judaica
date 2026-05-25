import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60 // revalidate every 60 seconds

export default async function Home() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false })

  const categories = [
    { icon: '🕎', name: 'חנוכיות', desc: 'חנוכיות מסורתיות ועיצוביות לכל טעם ותקציב', slug: 'חנוכיות' },
    { icon: '📜', name: 'מזוזות', desc: 'מזוזות כשרות בעיצובים מגוונים לכל דלת בביתכם', slug: 'מזוזות' },
    { icon: '🪬', name: 'תכשיטים', desc: 'חמסות, שרשראות וצמידים עם סמלים יהודיים', slug: 'תכשיטים' },
    { icon: '🕯️', name: 'שבת וחגים', desc: 'מנורות שבת, גביעי קידוש, מכלי בשמים ועוד', slug: 'שבת וחגים' },
    { icon: '🖼️', name: 'אמנות לבית', desc: 'תמונות, מפות ישראל ויצירות אמנות יהודית לבית', slug: 'אמנות לבית' },
    { icon: '🎁', name: 'מתנות מיוחדות', desc: 'סטים מאורזים לבר מצווה, חתונה ואירועים מיוחדים', slug: 'מתנות' },
  ]

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
            {categories.map(cat => (
              <a key={cat.slug} href={`#products`} className="category-card">
                <span className="cat-icon">{cat.icon}</span>
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCTS ══════════════════════════════════════════ */}
      <section className="section products-section" id="products">
        <div className="container">
          <div className="section-header">
            <div className="section-label">מוצרים</div>
            <h2>המוצרים הנבחרים שלנו</h2>
            <p>הפריטים הפופולריים ביותר בחנות</p>
          </div>

          {products && products.length > 0 ? (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🏪</p>
              <p>המוצרים יתווספו בקרוב</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ ABOUT ══════════════════════════════════════════════ */}
      <section className="section" id="about">
        <div className="container about-inner">
          <div className="about-visual">✡</div>
          <div className="about-content">
            <div className="section-label">עלינו</div>
            <h2>שנים של אהבה<br />למסורת היהודית</h2>
            <p>ב״שי לי יודאיקה״ אנחנו מאמינים שכל פריט יהודי הוא יותר מסתם חפץ — הוא חיבור לשורשים, לזיכרון ולזהות.</p>
            <p>אנחנו בוחרים בקפידה כל מוצר — בין אם הוא יצא מידי אומן ישראלי, בין אם הגיע מהמקורות הטובים ביותר בעולם.</p>
            <div className="about-stats">
              <div className="stat"><h3>+500</h3><p>פריטים בקטלוג</p></div>
              <div className="stat"><h3>+2K</h3><p>לקוחות מרוצים</p></div>
              <div className="stat"><h3>10+</h3><p>שנות ניסיון</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ════════════════════════════════════════════════ */}
      <section className="cta-banner" id="contact">
        <h2>מחפשים מתנה מיוחדת?</h2>
        <p>צרו איתנו קשר ונמצא יחד את הפריט המושלם עבורכם</p>
        <a href="mailto:info@shailiyudaika.co.il" className="btn-gold">צרו קשר עכשיו</a>
      </section>

      <Footer />
    </>
  )
}
