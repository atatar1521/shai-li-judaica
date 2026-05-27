import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DeleteCategoryButton from '../DeleteCategoryButton'

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

describe('DeleteCategoryButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockEq.mockResolvedValue({ error: null })
  })

  it('renders a delete button with Hebrew label', () => {
    render(<DeleteCategoryButton id="c1" name="חנוכיות" />)
    expect(screen.getByRole('button', { name: 'מחיקה' })).toBeInTheDocument()
  })

  it('calls Supabase delete and router.refresh when user confirms', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true)
    render(<DeleteCategoryButton id="c1" name="חנוכיות" />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(mockEq).toHaveBeenCalledWith('id', 'c1'))
    expect(mockRouterRefresh).toHaveBeenCalled()
    jest.restoreAllMocks()
  })

  it('does NOT call delete when user cancels the confirmation', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false)
    render(<DeleteCategoryButton id="c1" name="חנוכיות" />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(mockEq).not.toHaveBeenCalled())
    expect(mockRouterRefresh).not.toHaveBeenCalled()
    jest.restoreAllMocks()
  })

  it('passes the category name in the confirm dialog message', () => {
    const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false)
    render(<DeleteCategoryButton id="c1" name="חנוכיות מיוחדת" />)
    fireEvent.click(screen.getByRole('button'))
    expect(confirm).toHaveBeenCalledWith(expect.stringContaining('חנוכיות מיוחדת'))
    jest.restoreAllMocks()
  })
})
