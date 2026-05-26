'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import CartSidebar from './CartSidebar'
import { getCart } from '@/lib/cart'
import Image from 'next/image'

export default function Nav() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const refreshCartCount = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const items = await getCart()
      setCartCount(items.reduce((sum, i) => sum + i.quantity, 0))
    } else {
      setCartCount(0)
    }
  }

  const loadUserAndRole = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      refreshCartCount()
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      setIsAdmin(profile?.role === 'admin')
    }
  }

  useEffect(() => {
    loadUserAndRole()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserAndRole()
      } else {
        setUser(null)
        setIsAdmin(false)
        setCartCount(0)
      }
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
    setIsAdmin(false)
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <nav>
        <div className="container nav-inner">
          {/* Logo — right side (RTL) */}
          <a href="/" className="logo">
            <Image
              src="/logo.png"
              alt="שי לי יודאיקה"
              width={48}
              height={48}
              priority
              className="logo-img"
              style={{ borderRadius: '8px', objectFit: 'contain' }}
            />
            שי לי <span>יודאיקה</span>
          </a>

          {/* Desktop nav links */}
          <ul className="nav-links">
            <li><a href="#categories">קטגוריות</a></li>
            <li><a href="#products">מוצרים</a></li>
            <li><a href="#about">עלינו</a></li>
            <li><a href="#contact">צור קשר</a></li>
            {isAdmin && (
              <li>
                <a href="/admin" style={{ color: 'var(--gold)', fontWeight: 700 }}>
                  ⚙️ ניהול
                </a>
              </li>
            )}
          </ul>

          {/* Right-side actions */}
          <div className="nav-actions">
            {/* Desktop: full cart pill button */}
            <button className="btn-cart btn-cart-desktop" onClick={() => setCartOpen(true)}>
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

            {/* Mobile: icon-only cart button */}
            <button className="btn-cart-icon" onClick={() => setCartOpen(true)} aria-label="סל קניות">
              🛒
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#c9a84c',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>{cartCount}</span>
              )}
            </button>

            {/* Desktop: user / login */}
            <div className="nav-user-desktop">
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#4a4a4a' }}>
                    {user.email?.split('@')[0]}
                  </span>
                  <button onClick={handleSignOut} style={{
                    background: 'none',
                    border: '1px solid #e8e4dc',
                    padding: '8px 16px',
                    borderRadius: '50px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    color: '#4a4a4a',
                    fontFamily: 'Heebo, sans-serif',
                  }}>
                    יציאה
                  </button>
                </div>
              ) : (
                <a href="/auth/login" style={{
                  background: 'none',
                  border: '1px solid #e8e4dc',
                  padding: '8px 16px',
                  borderRadius: '50px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  color: '#4a4a4a',
                  textDecoration: 'none',
                  fontFamily: 'Heebo, sans-serif',
                }}>
                  כניסה
                </a>
              )}
            </div>

            {/* Hamburger — mobile only */}
            <button
              className="hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="פתח תפריט"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile menu backdrop */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 300,
          }}
        />
      )}

      {/* Mobile menu panel */}
      <div style={{
        position: 'fixed',
        top: 0, right: 0,
        height: '100vh',
        width: '280px',
        maxWidth: '85vw',
        background: '#fff',
        zIndex: 301,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        gap: '8px',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 700, fontSize: '1.1rem' }}>תפריט</span>
          <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888', lineHeight: 1 }}>×</button>
        </div>

        {[
          { href: '#categories', label: 'קטגוריות' },
          { href: '#products', label: 'מוצרים' },
          { href: '#about', label: 'עלינו' },
          { href: '#contact', label: 'צור קשר' },
        ].map(link => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block',
              padding: '14px 0',
              borderBottom: '1px solid #f0ece4',
              textDecoration: 'none',
              color: '#111',
              fontSize: '1.05rem',
              fontWeight: 500,
            }}
          >
            {link.label}
          </a>
        ))}

        {isAdmin && (
          <a
            href="/admin"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block',
              padding: '14px 0',
              borderBottom: '1px solid #f0ece4',
              textDecoration: 'none',
              color: 'var(--gold)',
              fontSize: '1.05rem',
              fontWeight: 700,
            }}
          >
            ⚙️ ניהול
          </a>
        )}

        {/* Login / user inside mobile menu */}
        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid #f0ece4' }}>
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '0.88rem', color: '#888' }}>{user.email}</span>
              <button onClick={() => { handleSignOut(); setMenuOpen(false) }} style={{
                background: '#111',
                color: '#fff',
                border: 'none',
                padding: '12px',
                borderRadius: '50px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Heebo, sans-serif',
              }}>
                יציאה
              </button>
            </div>
          ) : (
            <a href="/auth/login" onClick={() => setMenuOpen(false)} style={{
              display: 'block',
              background: '#111',
              color: '#fff',
              textAlign: 'center',
              padding: '12px',
              borderRadius: '50px',
              fontSize: '0.95rem',
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: 'Heebo, sans-serif',
            }}>
              כניסה / הרשמה
            </a>
          )}
        </div>
      </div>
    </>
  )
}
