'use client'

import { useEffect, useState } from 'react'
import { getCart, removeFromCart, updateQuantity, type CartItem } from '@/lib/cart'
import { createClient } from '@/lib/supabase/client'

export default function CartSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const loadCart = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setIsLoggedIn(!!user)
    if (user) {
      const data = await getCart()
      setItems(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (open) loadCart()
  }, [open])

  useEffect(() => {
    const handler = () => loadCart()
    window.addEventListener('cart-updated', handler)
    return () => window.removeEventListener('cart-updated', handler)
  }, [])

  const handleRemove = async (id: string) => {
    await removeFromCart(id)
    setItems(items.filter(i => i.id !== id))
  }

  const handleQty = async (id: string, qty: number) => {
    await updateQuantity(id, qty)
    if (qty <= 0) {
      setItems(items.filter(i => i.id !== id))
    } else {
      setItems(items.map(i => i.id === id ? { ...i, quantity: qty } : i))
    }
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.35)',
            zIndex: 200,
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '380px',
        maxWidth: '95vw',
        background: '#fff',
        zIndex: 201,
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e8e4dc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: '1.3rem' }}>
            🛒 סל הקניות
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: '1.4rem',
            cursor: 'pointer', color: '#888', lineHeight: 1,
          }}>×</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {!isLoggedIn ? (
            <div style={{ textAlign: 'center', paddingTop: '40px' }}>
              <p style={{ color: '#888', marginBottom: '16px' }}>יש להתחבר כדי לצפות בסל</p>
              <a href="/auth/login" style={{
                background: '#1a1a1a', color: '#fff',
                padding: '10px 24px', borderRadius: '50px',
                textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
              }}>כניסה</a>
            </div>
          ) : loading ? (
            <p style={{ color: '#888', textAlign: 'center', paddingTop: '40px' }}>טוען...</p>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '40px' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛒</p>
              <p style={{ color: '#888' }}>הסל ריק</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map(item => (
                <div key={item.id} style={{
                  display: 'flex', gap: '12px', alignItems: 'center',
                  padding: '12px', border: '1px solid #e8e4dc', borderRadius: '12px',
                }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '8px',
                    background: 'linear-gradient(135deg,#fdf9f0,#f5ede0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.6rem', flexShrink: 0,
                  }}>
                    {item.product.image_url
                      ? <img src={item.product.image_url} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                      : '🪬'
                    }
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{item.product.name}</p>
                    <p style={{ color: '#c9a84c', fontWeight: 700, fontSize: '0.9rem' }}>
                      ₪{(item.product.price * item.quantity).toLocaleString('he-IL')}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button onClick={() => handleQty(item.id, item.quantity - 1)}
                      style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #e8e4dc', background: '#fff', cursor: 'pointer', fontSize: '0.9rem' }}>−</button>
                    <span style={{ fontSize: '0.9rem', minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => handleQty(item.id, item.quantity + 1)}
                      style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #e8e4dc', background: '#fff', cursor: 'pointer', fontSize: '0.9rem' }}>+</button>
                    <button onClick={() => handleRemove(item.id)}
                      style={{ marginRight: '4px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1rem' }}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer total */}
        {items.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid #e8e4dc',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontWeight: 600 }}>סה&quot;כ</span>
              <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: '1.2rem', fontWeight: 700, color: '#c9a84c' }}>
                ₪{total.toLocaleString('he-IL')}
              </span>
            </div>
            <button style={{
              width: '100%', background: '#1a1a1a', color: '#fff',
              border: 'none', padding: '14px', borderRadius: '50px',
              fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Heebo, sans-serif',
            }}>
              המשך לקופה
            </button>
          </div>
        )}
      </div>
    </>
  )
}
