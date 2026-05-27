import Link from 'next/link'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

export default async function Home() {
  const supabase = await createClient()

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('in_stock', true).order('created_at', { ascending: false }),
    supabase.from('categories').select('name').order('display_order'),
  ])

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
            {categories?.map(cat => (
              <Link
                key={cat.name}
                href={`/shop?cat=${encodeURIComponent(cat.name)}`}
                className="category-card"
              >
                <h3>{cat.name}</h3>
                <span className="category-card-arrow">←</span>
              </Link>
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
        <div className="contact-buttons">
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}`}
            className="contact-btn"
            target="_blank"
            rel="noreferrer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>WhatsApp</span>
          </a>
          <a href="mailto:Tair060215@gmail.com" className="contact-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <span>אימייל</span>
          </a>
          <a href={`tel:+${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}`} className="contact-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>טלפון</span>
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}
