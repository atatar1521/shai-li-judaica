import { render, screen } from '@testing-library/react'
import AdminLayout from '../layout'

const mockRedirect = jest.fn()
const mockGetUser = jest.fn()
const mockFrom = jest.fn()

jest.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}))

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(async () => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}))

function setupProfile(role: string | null) {
  mockFrom.mockReturnValue({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: role ? { role } : null }),
  })
}

describe('AdminLayout', () => {
  beforeEach(() => jest.clearAllMocks())

  it('redirects to login when user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    setupProfile(null)
    try {
      await AdminLayout({ children: <div>child</div> })
    } catch {}
    expect(mockRedirect).toHaveBeenCalledWith('/auth/login?redirect=/admin')
  })

  it('redirects to / when authenticated user has non-admin role', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    setupProfile('user')
    try {
      await AdminLayout({ children: <div>child</div> })
    } catch {}
    expect(mockRedirect).toHaveBeenCalledWith('/')
  })

  it('renders children for admin user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin1' } } })
    setupProfile('admin')
    const result = await AdminLayout({ children: <div>admin content</div> })
    render(result as React.ReactElement)
    expect(screen.getByText('admin content')).toBeInTheDocument()
  })

  it('renders admin panel header for admin user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin1' } } })
    setupProfile('admin')
    const result = await AdminLayout({ children: <div /> })
    render(result as React.ReactElement)
    expect(screen.getByText('פאנל ניהול')).toBeInTheDocument()
  })
})
