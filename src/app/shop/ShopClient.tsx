'use client'

import { useState } from 'react'
import ProductCard from '@/components/ProductCard'

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  category: string | null
  image_url: string | null
  badge: string | null
  in_stock: boolean
}

type SortOption = 'newest' | 'price-asc' | 'price-desc'

type Props = {
  products: Product[]
  categories: string[]
  initialCategory: string | null
}

export default function ShopClient({ products, categories, initialCategory }: Props) {
  const [selectedCats, setSelectedCats] = useState<Set<string>>(
    initialCategory ? new Set([initialCategory]) : new Set()
  )
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [badgeFilter, setBadgeFilter] = useState<string | null>(null)

  const badges = [...new Set(products.map(p => p.badge).filter(Boolean))] as string[]

  const toggleCategory = (cat: string) => {
    setSelectedCats(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  let filtered = [...products]
  if (selectedCats.size > 0) filtered = filtered.filter(p => p.category && selectedCats.has(p.category))
  if (inStockOnly) filtered = filtered.filter(p => p.in_stock)
  if (badgeFilter) filtered = filtered.filter(p => p.badge === badgeFilter)
  if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price)
  else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price)

  const clearAll = () => {
    setSelectedCats(new Set())
    setSortBy('newest')
    setInStockOnly(false)
    setBadgeFilter(null)
  }

  const hasActiveFilters = selectedCats.size > 0 || inStockOnly || badgeFilter !== null || sortBy !== 'newest'

  return (
    <div className="shop-body">
      {/* Category chips — multi select */}
      <div className="shop-cat-filter">
        <button
          className={`filter-chip${selectedCats.size === 0 ? ' active' : ''}`}
          onClick={() => setSelectedCats(new Set())}
        >
          הכל
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-chip${selectedCats.has(cat) ? ' active' : ''}`}
            onClick={() => toggleCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort / in-stock / badge bar */}
      <div className="filter-bar">
        <div className="filter-bar-right">
          <select
            className="filter-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
          >
            <option value="newest">חדש ביותר</option>
            <option value="price-asc">מחיר: נמוך לגבוה</option>
            <option value="price-desc">מחיר: גבוה לנמוך</option>
          </select>

          <label className="toggle-label">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={e => setInStockOnly(e.target.checked)}
              className="toggle-input"
            />
            <span className="toggle-track" />
            <span className="toggle-text">במלאי בלבד</span>
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {badges.length > 0 && (
            <div className="badge-chips">
              <button
                className={`filter-chip${badgeFilter === null ? ' active' : ''}`}
                onClick={() => setBadgeFilter(null)}
              >
                כל התגים
              </button>
              {badges.map(badge => (
                <button
                  key={badge}
                  className={`filter-chip${badgeFilter === badge ? ' active' : ''}`}
                  onClick={() => setBadgeFilter(badge === badgeFilter ? null : badge)}
                >
                  {badge}
                </button>
              ))}
            </div>
          )}

          {hasActiveFilters && (
            <button className="filter-chip" onClick={clearAll} style={{ color: '#e55' }}>
              נקה הכל ✕
            </button>
          )}
        </div>
      </div>

      <p className="results-count">{filtered.length} מוצרים</p>

      {filtered.length > 0 ? (
        <div className="products-grid">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="shop-empty">
          <p className="shop-empty-icon">🔍</p>
          <p>לא נמצאו מוצרים התואמים לסינון הנבחר</p>
          <button
            className="btn-gold"
            style={{ marginTop: '16px', border: 'none', cursor: 'pointer' }}
            onClick={clearAll}
          >
            נקה סינון
          </button>
        </div>
      )}
    </div>
  )
}
