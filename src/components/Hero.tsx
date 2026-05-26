import Image from 'next/image'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <div className="hero-badge">✡ פריטי יודאיקה מובחרים</div>
          <h1>
            מתנות<br />
            <em>יהודיות</em><br />
            ייחודיות
          </h1>
          <p className="hero-desc">
            אוסף מקיף של פריטי יודאיקה איכותיים — מחנוכיות ומזוזות ועד תכשיטים ואמנות יהודית לבית.
            המתנה המושלמת לכל אירוע.
          </p>
          <div className="hero-cta">
            <a href="#products" className="btn-primary">לקטלוג המוצרים</a>
            <a href="#about" className="btn-secondary">קצת עלינו ←</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-logo-embed">
            <Image
              src="/logo.png"
              alt="שי לי יודאיקה"
              width={460}
              height={460}
              priority
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <p className="hero-logo-caption">אוסף חנוכה 2025</p>
        </div>
      </div>
    </section>
  )
}
