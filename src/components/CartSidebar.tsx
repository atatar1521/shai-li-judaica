'use client'

import { useEffect, useState } from 'react'
import { getCart, removeFromCart, updateQuantity, type CartItem } from '@/lib/cart'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

export default function CartSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [items, setItems] = useState<CartItem[]>([])

  const loadCart = async () => {
    setItems(await getCart())
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
          {items.length === 0 ? (
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

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #e8e4dc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontWeight: 600 }}>סה&quot;כ</span>
              <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: '1.2rem', fontWeight: 700, color: '#c9a84c' }}>
                ₪{total.toLocaleString('he-IL')}
              </span>
            </div>
            <a
              href={buildWhatsAppUrl(items)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                width: '100%', background: '#25D366', color: '#fff',
                border: 'none', padding: '14px', borderRadius: '50px',
                fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Heebo, sans-serif', textDecoration: 'none',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#1ebe5d')}
              onMouseLeave={e => (e.currentTarget.style.background = '#25D366')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              שלח הזמנה בוואטסאפ
            </a>
          </div>
        )}
      </div>
    </>
  )
}
