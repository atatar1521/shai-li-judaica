'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function Nav() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
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
          <button className="btn-cart">🛒 סל קניות</button>

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
  )
}
