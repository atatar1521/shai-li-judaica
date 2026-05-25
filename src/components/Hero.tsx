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
          <div className="hero-showcase">
            <div className="hero-showcase-tag">חדש</div>
            <div className="hero-showcase-icon">🕎</div>
            <p>אוסף חנוכה 2025</p>
          </div>
        </div>
      </div>
    </section>
  )
}
