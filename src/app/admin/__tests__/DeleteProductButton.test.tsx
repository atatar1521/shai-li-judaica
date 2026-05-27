import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DeleteProductButton from '../DeleteProductButton'

const mockDelete = jest.fn()
const mockEq = jest.fn()
const mockRouterRefresh = jest.fn()

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      delete: jest.fn(() => ({ eq: mockEq })),
    })),
  })),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRouterRefresh }),
}))

describe('DeleteProductButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockEq.mockResolvedValue({ error: null })
  })

  it('renders a delete button with Hebrew label', () => {
    render(<DeleteProductButton id="p1" name="מזוזה" />)
    expect(screen.getByRole('button', { name: 'מחיקה' })).toBeInTheDocument()
  })

  it('calls Supabase delete and router.refresh when user confirms', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true)
    render(<DeleteProductButton id="p1" name="מזוזה" />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(mockEq).toHaveBeenCalledWith('id', 'p1'))
    expect(mockRouterRefresh).toHaveBeenCalled()
    jest.restoreAllMocks()
  })

  it('does NOT call delete when user cancels the confirmation', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false)
    render(<DeleteProductButton id="p1" name="מזוזה" />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(mockEq).not.toHaveBeenCalled())
    expect(mockRouterRefresh).not.toHaveBeenCalled()
    jest.restoreAllMocks()
  })

  it('passes the product name in the confirm dialog message', async () => {
    const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false)
    render(<DeleteProductButton id="p1" name="חנוכייה מיוחדת" />)
    fireEvent.click(screen.getByRole('button'))
    expect(confirm).toHaveBeenCalledWith(expect.stringContaining('חנוכייה מיוחדת'))
    jest.restoreAllMocks()
  })
})
