'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Category = { name: string }

export default function CategoriesSection({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <div className="categories-grid">
        {categories.map((cat, i) => (
          <Link
            key={cat.name}
            href={`/shop?cat=${encodeURIComponent(cat.name)}`}
            className={[
              'category-card',
              i >= 6 ? 'cat--hidden' : '',
              i >= 4 && i < 6 ? 'cat--desktop-only' : '',
            ].filter(Boolean).join(' ')}
          >
            <h3>{cat.name}</h3>
            <span className="category-card-arrow">←</span>
          </Link>
        ))}
      </div>

      {categories.length > 4 && (
        <div className="categories-show-all">
          <button className="categories-show-all-btn" onClick={() => setOpen(true)}>
            כל הקטגוריות
            <span className="categories-show-all-arrow">←</span>
          </button>
        </div>
      )}

      {open && (
        <div className="drawer-backdrop" data-testid="drawer-backdrop" onClick={() => setOpen(false)}>
          <div className="drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-handle" />
            <div className="drawer-header">
              <h3>כל הקטגוריות</h3>
              <button className="drawer-close" onClick={() => setOpen(false)} aria-label="סגור">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="drawer-grid">
              {categories.map(cat => (
                <Link
                  key={cat.name}
                  href={`/shop?cat=${encodeURIComponent(cat.name)}`}
                  className="category-card"
                  onClick={() => setOpen(false)}
                >
                  <h3>{cat.name}</h3>
                  <span className="category-card-arrow">←</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
