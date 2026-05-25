'use client'

export default function Nav() {
  return (
    <nav>
      <div className="container nav-inner">
        <a href="#" className="logo">שי לי <span>יודאיקה</span></a>

        <ul className="nav-links">
          <li><a href="#categories">קטגוריות</a></li>
          <li><a href="#products">מוצרים</a></li>
          <li><a href="#about">עלינו</a></li>
          <li><a href="#contact">צור קשר</a></li>
        </ul>

        <div className="nav-actions">
          <button className="btn-cart">🛒 סל קניות</button>
        </div>
      </div>
    </nav>
  )
}
