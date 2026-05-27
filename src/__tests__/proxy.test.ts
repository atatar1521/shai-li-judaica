import { proxy } from '../proxy'
import { NextRequest } from 'next/server'

const mockGetUser = jest.fn()
const mockFrom = jest.fn()

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}))

function makeRequest(pathname: string): NextRequest {
  return new NextRequest(`http://localhost${pathname}`)
}

function mockProfile(role: string | null) {
  mockFrom.mockReturnValue({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: role ? { role } : null }),
  })
}

describe('proxy middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
  })

  it('passes through non-admin routes without checking auth', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const res = await proxy(makeRequest('/'))
    expect(res.status).toBe(200)
    expect(res.headers.get('location')).toBeNull()
  })

  it('redirects unauthenticated requests to /admin → /auth/login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const res = await proxy(makeRequest('/admin'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/auth/login')
  })

  it('redirects authenticated non-admin user to /', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    mockProfile('user')
    const res = await proxy(makeRequest('/admin'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toMatch(/\/$/)
  })

  it('allows authenticated admin user through /admin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    mockProfile('admin')
    const res = await proxy(makeRequest('/admin'))
    expect(res.status).toBe(200)
    expect(res.headers.get('location')).toBeNull()
  })

  it('redirects to /admin path redirect param when unauthenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const res = await proxy(makeRequest('/admin/products/new'))
    expect(res.headers.get('location')).toContain('redirect=%2Fadmin%2Fproducts%2Fnew')
  })

  it('passes cookie getAll/setAll handlers into createServerClient', async () => {
    const { createServerClient } = jest.requireMock('@supabase/ssr') as { createServerClient: jest.Mock }
    mockGetUser.mockResolvedValue({ data: { user: null } })
    await proxy(makeRequest('/'))
    const cookiesArg = createServerClient.mock.calls[0][2].cookies
    expect(typeof cookiesArg.getAll).toBe('function')
    expect(typeof cookiesArg.setAll).toBe('function')
    // Call them to ensure the code paths execute
    cookiesArg.getAll()
    cookiesArg.setAll([{ name: 'x', value: 'y', options: {} }])
  })
})
