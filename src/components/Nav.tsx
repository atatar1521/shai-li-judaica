'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import CartSidebar from './CartSidebar'
import { getCart } from '@/lib/cart'

export default function Nav() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  const refreshCartCount = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const items = await getCart()
      setCartCount(items.reduce((sum, i) => sum + i.quantity, 0))
    } else {
      setCartCount(0)
    }
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) refreshCartCount()
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) refreshCartCount()
      else setCartCount(0)
    })

    window.addEventListener('cart-updated', refreshCartCount)
    return () => {
      listener.subscription.unsubscribe()
      window.removeEventListener('cart-updated', refreshCartCount)
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setCartCount(0)
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <nav>
        <div className="container nav-inner">
          <a href="/" className="logo">שי לי <span>יודאיקה</span></a>

          <ul className="nav-links">
            <li><a href="#categories">קטגוריות</a></li>
            <li><a href="#products">מוצרים</a></li>
            <li><a href="#about">עלינו</a></li>
            <li><a href="#contact">צור קשר</a></li>
          </ul>

          <div className="nav-actions">
            <button className="btn-cart" onClick={() => setCartOpen(true)}>
              🛒 סל קניות
              {cartCount > 0 && (
                <span style={{
                  background: '#c9a84c',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '2px',
                }}>{cartCount}</span>
              )}
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: '#4a4a4a' }}>
                  {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleSignOut}
                  style={{
                    background: 'none',
                    border: '1px solid #e8e4dc',
                    padding: '8px 16px',
                    borderRadius: '50px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    color: '#4a4a4a',
                    fontFamily: 'Heebo, sans-serif',
                  }}
                >
                  יציאה
                </button>
              </div>
            ) : (
              <a
                href="/auth/login"
                style={{
                  background: 'none',
                  border: '1px solid #e8e4dc',
                  padding: '8px 16px',
                  borderRadius: '50px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  color: '#4a4a4a',
                  textDecoration: 'none',
                  fontFamily: 'Heebo, sans-serif',
                }}
              >
                כניסה
              </a>
            )}
          </div>
        </div>
      </nav>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
