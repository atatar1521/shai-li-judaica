import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '../page'

const mockSignInWithPassword = jest.fn()
const mockSignUp = jest.fn()
const mockSignInWithOAuth = jest.fn()
const mockRouterPush = jest.fn()
const mockGetSearchParam = jest.fn().mockReturnValue(null)

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signInWithOAuth: mockSignInWithOAuth,
    },
  })),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  useSearchParams: () => ({ get: mockGetSearchParam }),
}))

describe('LoginPage', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders the email input', () => {
    render(<LoginPage />)
    expect(screen.getByPlaceholderText('אימייל')).toBeInTheDocument()
  })

  it('renders the password input', () => {
    render(<LoginPage />)
    expect(screen.getByPlaceholderText('סיסמה')).toBeInTheDocument()
  })

  it('renders the Google login button', () => {
    render(<LoginPage />)
    expect(screen.getByRole('button', { name: /Google/ })).toBeInTheDocument()
  })

  it('shows sign-in submit button by default', () => {
    render(<LoginPage />)
    expect(screen.getByRole('button', { name: 'כניסה' })).toBeInTheDocument()
  })

  it('switches to sign-up mode when toggle is clicked', async () => {
    render(<LoginPage />)
    fireEvent.click(screen.getByRole('button', { name: 'הירשמו' }))
    expect(screen.getByRole('button', { name: 'הרשמה' })).toBeInTheDocument()
  })

  it('switches back to sign-in mode from sign-up mode', async () => {
    render(<LoginPage />)
    fireEvent.click(screen.getByRole('button', { name: 'הירשמו' }))
    fireEvent.click(screen.getByRole('button', { name: 'התחברו' }))
    expect(screen.getByRole('button', { name: 'כניסה' })).toBeInTheDocument()
  })

  it('calls signInWithPassword on sign-in submit', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null })
    render(<LoginPage />)
    await userEvent.type(screen.getByPlaceholderText('אימייל'), 'test@test.com')
    await userEvent.type(screen.getByPlaceholderText('סיסמה'), 'password123')
    fireEvent.submit(screen.getByRole('button', { name: 'כניסה' }).closest('form')!)
    await waitFor(() => expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123',
    }))
  })

  it('redirects after successful sign-in', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null })
    mockGetSearchParam.mockReturnValue('/admin')
    render(<LoginPage />)
    await userEvent.type(screen.getByPlaceholderText('אימייל'), 'test@test.com')
    await userEvent.type(screen.getByPlaceholderText('סיסמה'), 'password123')
    fireEvent.submit(screen.getByRole('button', { name: 'כניסה' }).closest('form')!)
    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith('/admin'))
  })

  it('shows error message on sign-in failure', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: { message: 'bad creds' } })
    render(<LoginPage />)
    await userEvent.type(screen.getByPlaceholderText('אימייל'), 'x@x.com')
    await userEvent.type(screen.getByPlaceholderText('סיסמה'), 'wrong')
    fireEvent.submit(screen.getByRole('button', { name: 'כניסה' }).closest('form')!)
    expect(await screen.findByText(/אימייל או סיסמה שגויים/)).toBeInTheDocument()
  })

  it('calls signUp on sign-up submit', async () => {
    mockSignUp.mockResolvedValue({ error: null })
    render(<LoginPage />)
    fireEvent.click(screen.getByRole('button', { name: 'הירשמו' }))
    await userEvent.type(screen.getByPlaceholderText('אימייל'), 'new@test.com')
    await userEvent.type(screen.getByPlaceholderText('סיסמה'), 'newpass123')
    fireEvent.submit(screen.getByRole('button', { name: 'הרשמה' }).closest('form')!)
    await waitFor(() => expect(mockSignUp).toHaveBeenCalled())
  })

  it('shows success message after sign-up', async () => {
    mockSignUp.mockResolvedValue({ error: null })
    render(<LoginPage />)
    fireEvent.click(screen.getByRole('button', { name: 'הירשמו' }))
    await userEvent.type(screen.getByPlaceholderText('אימייל'), 'new@test.com')
    await userEvent.type(screen.getByPlaceholderText('סיסמה'), 'newpass123')
    fireEvent.submit(screen.getByRole('button', { name: 'הרשמה' }).closest('form')!)
    expect(await screen.findByText(/בדקו את האימייל/)).toBeInTheDocument()
  })

  it('calls signInWithOAuth when Google button is clicked', async () => {
    mockSignInWithOAuth.mockResolvedValue({})
    render(<LoginPage />)
    fireEvent.click(screen.getByRole('button', { name: /Google/ }))
    await waitFor(() => expect(mockSignInWithOAuth).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'google' })
    ))
  })
})
