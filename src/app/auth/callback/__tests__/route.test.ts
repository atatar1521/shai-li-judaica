import { GET } from '../route'
import { NextRequest } from 'next/server'

const mockExchangeCodeForSession = jest.fn()
const mockGetAll = jest.fn().mockReturnValue([])
const mockSetAll = jest.fn()

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    auth: { exchangeCodeForSession: mockExchangeCodeForSession },
  })),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() =>
    Promise.resolve({ getAll: mockGetAll, set: jest.fn(), setAll: mockSetAll })
  ),
}))

function makeRequest(params: Record<string, string>): NextRequest {
  const url = new URL('http://localhost/auth/callback')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return new NextRequest(url.toString())
}

describe('GET /auth/callback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
  })

  it('redirects to / when code exchange succeeds without next param', async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null })
    const res = await GET(makeRequest({ code: 'valid-code' }))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('http://localhost/')
  })

  it('redirects to the next param path on successful code exchange', async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null })
    const res = await GET(makeRequest({ code: 'valid-code', next: '/admin' }))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('http://localhost/admin')
  })

  it('redirects to /auth/login?error=auth_failed when code exchange fails', async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: { message: 'invalid' } })
    const res = await GET(makeRequest({ code: 'bad-code' }))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/auth/login?error=auth_failed')
  })

  it('redirects to /auth/login?error=auth_failed when no code is present', async () => {
    const res = await GET(makeRequest({}))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/auth/login?error=auth_failed')
  })

  it('cookie handlers (getAll/setAll) are callable', async () => {
    const { createServerClient } = jest.requireMock('@supabase/ssr') as { createServerClient: jest.Mock }
    mockExchangeCodeForSession.mockResolvedValue({ error: null })
    await GET(makeRequest({ code: 'x' }))
    const cookiesArg = createServerClient.mock.calls[0][2].cookies
    cookiesArg.getAll()
    cookiesArg.setAll([{ name: 'sb', value: 'val', options: {} }])
  })
})
