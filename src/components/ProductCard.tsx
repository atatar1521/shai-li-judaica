'use client'

import { useState } from 'react'
import { addToCart } from '@/lib/cart'

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

export default function ProductCard({ product }: { product: Product }) {
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async () => {
    setAdding(true)
    await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      badge: product.badge,
    })
    setAdding(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="product-card">
      <div className="product-img">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span>🪬</span>
        )}
        {product.badge && (
          <div className="product-badge">{product.badge}</div>
        )}
        {!product.in_stock && (
          <div className="product-badge" style={{ background: '#888' }}>אזל</div>
        )}
      </div>

      <div className="product-info">
        <h4>{product.name}</h4>
        {product.description && (
          <p className="sub">{product.description}</p>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <div className="product-price">
            ₪ {product.price.toLocaleString('he-IL')} <span>כולל מע&quot;מ</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding || !product.in_stock}
            style={{
              background: added ? '#2e7d32' : product.in_stock ? 'var(--dark)' : '#ccc',
              color: '#fff',
              border: 'none',
              padding: '7px 14px',
              borderRadius: '50px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: product.in_stock ? 'pointer' : 'not-allowed',
              fontFamily: 'Heebo, sans-serif',
              transition: 'background 0.3s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {added ? '✓ נוסף' : adding ? '...' : '+ סל'}
          </button>
        </div>
      </div>
    </div>
  )
}
