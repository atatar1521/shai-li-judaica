import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddCategoryForm from '../AddCategoryForm'

const mockInsert = jest.fn()
const mockRouterRefresh = jest.fn()

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: mockInsert,
    })),
  })),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRouterRefresh }),
}))

describe('AddCategoryForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockInsert.mockResolvedValue({ error: null })
  })

  it('renders name input and submit button', () => {
    render(<AddCategoryForm />)
    expect(screen.getByPlaceholderText(/שם הקטגוריה/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'הוסף קטגוריה' })).toBeInTheDocument()
  })

  it('calls supabase insert with the entered name on submit', async () => {
    render(<AddCategoryForm />)
    await userEvent.type(screen.getByPlaceholderText(/שם הקטגוריה/), 'בדיקה')
    fireEvent.submit(screen.getByRole('button', { name: 'הוסף קטגוריה' }).closest('form')!)
    await waitFor(() => expect(mockInsert).toHaveBeenCalledWith({ name: 'בדיקה' }))
  })

  it('calls router.refresh() on successful insert', async () => {
    render(<AddCategoryForm />)
    await userEvent.type(screen.getByPlaceholderText(/שם הקטגוריה/), 'בדיקה')
    fireEvent.submit(screen.getByRole('button', { name: 'הוסף קטגוריה' }).closest('form')!)
    await waitFor(() => expect(mockRouterRefresh).toHaveBeenCalled())
  })

  it('shows error message on duplicate / insert failure', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'duplicate key value violates unique constraint' } })
    render(<AddCategoryForm />)
    await userEvent.type(screen.getByPlaceholderText(/שם הקטגוריה/), 'קיים כבר')
    fireEvent.submit(screen.getByRole('button', { name: 'הוסף קטגוריה' }).closest('form')!)
    expect(await screen.findByText(/duplicate key/)).toBeInTheDocument()
    expect(mockRouterRefresh).not.toHaveBeenCalled()
  })
})
