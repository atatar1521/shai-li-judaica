'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
      },
    })
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) setError(error.message)
      else setMessage('!בדקו את האימייל שלכם לאישור ההרשמה')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('אימייל או סיסמה שגויים')
      else router.push(redirect)
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fefefe 0%, #f5f0e8 100%)',
      padding: '24px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        border: '1px solid #e8e4dc',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.07)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <a href="/" style={{
            fontFamily: "'Frank Ruhl Libre', serif",
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#1a1a1a',
            textDecoration: 'none',
          }}>
            שי לי <span style={{ color: '#c9a84c' }}>יודאיקה</span>
          </a>
          <p style={{ color: '#888', marginTop: '8px', fontSize: '0.95rem' }}>
            {isSignUp ? 'צרו חשבון חדש' : 'ברוכים הבאים חזרה'}
          </p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogle}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '12px',
            border: '1px solid #e8e4dc',
            borderRadius: '50px',
            background: '#fff',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 500,
            color: '#1a1a1a',
            marginBottom: '24px',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#c9a84c')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e4dc')}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
          </svg>
          המשיכו עם Google
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px',
        }}>
          <div style={{ flex: 1, height: '1px', background: '#e8e4dc' }} />
          <span style={{ color: '#888', fontSize: '0.85rem' }}>או</span>
          <div style={{ flex: 1, height: '1px', background: '#e8e4dc' }} />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              padding: '12px 16px',
              border: '1px solid #e8e4dc',
              borderRadius: '12px',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'Heebo, sans-serif',
              textAlign: 'right',
            }}
          />
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              padding: '12px 16px',
              border: '1px solid #e8e4dc',
              borderRadius: '12px',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'Heebo, sans-serif',
              textAlign: 'right',
            }}
          />

          {error && (
            <p style={{ color: '#e53935', fontSize: '0.88rem', textAlign: 'center' }}>{error}</p>
          )}
          {message && (
            <p style={{ color: '#2e7d32', fontSize: '0.88rem', textAlign: 'center' }}>{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#888' : '#1a1a1a',
              color: '#fff',
              border: 'none',
              padding: '13px',
              borderRadius: '50px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Heebo, sans-serif',
              transition: 'background 0.3s ease',
            }}
          >
            {loading ? '...' : isSignUp ? 'הרשמה' : 'כניסה'}
          </button>
        </form>

        {/* Toggle Sign up / Sign in */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#4a4a4a' }}>
          {isSignUp ? 'כבר יש לכם חשבון?' : 'אין לכם חשבון עדיין?'}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage('') }}
            style={{
              background: 'none', border: 'none', color: '#c9a84c',
              fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
              fontFamily: 'Heebo, sans-serif',
            }}
          >
            {isSignUp ? 'התחברו' : 'הירשמו'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
