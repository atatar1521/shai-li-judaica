import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Nav from '../Nav'

const mockGetUser = jest.fn()
const mockFrom = jest.fn()
const mockSignOut = jest.fn()
const mockOnAuthStateChange = jest.fn().mockReturnValue({
  data: { subscription: { unsubscribe: jest.fn() } },
})
const mockGetCart = jest.fn().mockResolvedValue([])
const mockRouterPush = jest.fn()
const mockRouterRefresh = jest.fn()

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: mockGetUser,
      signOut: mockSignOut,
      onAuthStateChange: mockOnAuthStateChange,
    },
    from: mockFrom,
  })),
}))

jest.mock('@/lib/cart', () => ({
  getCart: (...args: unknown[]) => mockGetCart(...args),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush, refresh: mockRouterRefresh }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

// CartSidebar spawns getCart too — mock it out
jest.mock('../CartSidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="cart-sidebar" />,
}))

function setupProfile(role: string | null) {
  mockFrom.mockReturnValue({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: role ? { role } : null }),
  })
}

describe('Nav — unauthenticated', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: null } })
    mockGetCart.mockResolvedValue([])
  })

  it('renders logo', async () => {
    render(<Nav />)
    expect(screen.getByAltText('שי לי יודאיקה')).toBeInTheDocument()
  })

  it('renders main nav links', async () => {
    render(<Nav />)
    expect(screen.getAllByText('קטגוריות').length).toBeGreaterThan(0)
    expect(screen.getAllByText('מוצרים').length).toBeGreaterThan(0)
  })

  it('shows login link when unauthenticated', async () => {
    render(<Nav />)
    await waitFor(() => {
      expect(screen.getAllByRole('link', { name: /כניסה/ }).length).toBeGreaterThan(0)
    })
  })

  it('does not show admin link when unauthenticated', async () => {
    render(<Nav />)
    await waitFor(() => expect(screen.queryByText(/ניהול/)).not.toBeInTheDocument())
  })
})

describe('Nav — authenticated regular user', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1', email: 'test@example.com' } } })
    setupProfile('user')
    mockGetCart.mockResolvedValue([{ id: 'p1', quantity: 3, product: { id: 'p1', name: 'X', price: 1, image_url: null, badge: null } }])
  })

  it('shows user email prefix', async () => {
    render(<Nav />)
    await waitFor(() => expect(screen.getByText('test')).toBeInTheDocument())
  })

  it('shows sign-out button', async () => {
    render(<Nav />)
    await waitFor(() => expect(screen.getAllByText('יציאה').length).toBeGreaterThan(0))
  })

  it('shows cart count badge when items > 0', async () => {
    render(<Nav />)
    await waitFor(() => expect(screen.getAllByText('3').length).toBeGreaterThan(0))
  })

  it('calls signOut and redirects on sign-out click', async () => {
    mockSignOut.mockResolvedValue({})
    render(<Nav />)
    await waitFor(() => screen.getAllByText('יציאה'))
    fireEvent.click(screen.getAllByText('יציאה')[0])
    await waitFor(() => expect(mockSignOut).toHaveBeenCalled())
    expect(mockRouterPush).toHaveBeenCalledWith('/')
  })
})

describe('Nav — admin user', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin1', email: 'admin@example.com' } } })
    setupProfile('admin')
    mockGetCart.mockResolvedValue([])
  })

  it('shows admin link for admin users', async () => {
    render(<Nav />)
    await waitFor(() => expect(screen.getAllByText(/ניהול/).length).toBeGreaterThan(0))
  })
})

describe('Nav — onAuthStateChange callback', () => {
  let authStateCallback: ((event: string, session: unknown) => void) | null = null

  beforeEach(() => {
    jest.clearAllMocks()
    mockOnAuthStateChange.mockImplementation((cb: (e: string, s: unknown) => void) => {
      authStateCallback = cb
      return { data: { subscription: { unsubscribe: jest.fn() } } }
    })
    mockGetUser.mockResolvedValue({ data: { user: null } })
    mockGetCart.mockResolvedValue([])
  })

  it('updates user state when auth state changes to signed-in', async () => {
    setupProfile('user')
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u2', email: 'new@test.com' } } })
    render(<Nav />)
    await waitFor(() => authStateCallback !== null)
    authStateCallback!('SIGNED_IN', { user: { id: 'u2', email: 'new@test.com' } })
    await waitFor(() => expect(screen.getByText('new')).toBeInTheDocument())
  })

  it('clears user state when auth state changes to signed-out', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    render(<Nav />)
    await waitFor(() => authStateCallback !== null)
    authStateCallback!('SIGNED_OUT', null)
    await waitFor(() => {
      expect(screen.queryByText('יציאה')).not.toBeInTheDocument()
    })
  })
})

describe('Nav — hamburger menu', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: null } })
    mockGetCart.mockResolvedValue([])
  })

  it('opens mobile menu when hamburger is clicked', async () => {
    render(<Nav />)
    fireEvent.click(screen.getByLabelText('פתח תפריט'))
    expect(screen.getByText('תפריט')).toBeInTheDocument()
  })

  it('closes mobile menu when × is clicked — backdrop disappears', async () => {
    const { container } = render(<Nav />)
    fireEvent.click(screen.getByLabelText('פתח תפריט'))
    // backdrop overlay (zIndex 300) is conditionally rendered
    await waitFor(() =>
      expect(Array.from(container.querySelectorAll('div'))
        .find(el => el.style.zIndex === '300')).toBeTruthy()
    )
    fireEvent.click(screen.getByText('×'))
    await waitFor(() =>
      expect(Array.from(container.querySelectorAll('div'))
        .find(el => el.style.zIndex === '300')).toBeUndefined()
    )
  })
})
