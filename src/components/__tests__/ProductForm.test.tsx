import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductForm from '../ProductForm'

const mockInsert = jest.fn()
const mockUpdate = jest.fn()
const mockEq = jest.fn()
const mockRouterPush = jest.fn()
const mockRouterBack = jest.fn()
const mockRouterRefresh = jest.fn()

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: mockInsert,
      update: jest.fn(() => ({ eq: mockEq })),
    })),
  })),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    back: mockRouterBack,
    refresh: mockRouterRefresh,
  }),
}))

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('ProductForm — new product', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockInsert.mockResolvedValue({ error: null })
  })

  it('renders all form fields', () => {
    render(<ProductForm />)
    expect(screen.getByPlaceholderText(/חנוכייה ירושלמית/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('189')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/תיאור קצר/)).toBeInTheDocument()
  })

  it('renders passed-in category options in the select', () => {
    render(<ProductForm categories={['חנוכיות', 'מזוזות']} />)
    expect(screen.getByRole('option', { name: 'חנוכיות' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'מזוזות' })).toBeInTheDocument()
  })

  it('renders the add-product submit button', () => {
    render(<ProductForm />)
    expect(screen.getByRole('button', { name: 'הוסף מוצר' })).toBeInTheDocument()
  })

  it('pre-fills form from initial prop', () => {
    render(<ProductForm initial={{ name: 'מנורה', price: '150', description: 'תיאור' }} />)
    expect(screen.getByDisplayValue('מנורה')).toBeInTheDocument()
  })

  it('shows edit button when initial.id is provided', () => {
    render(<ProductForm initial={{ id: 'p1', name: 'מנורה', price: '150' }} />)
    expect(screen.getByRole('button', { name: 'שמור שינויים' })).toBeInTheDocument()
  })

  it('calls supabase insert on valid new product submit', async () => {
    render(<ProductForm />)
    await userEvent.type(screen.getByPlaceholderText(/חנוכייה ירושלמית/), 'מזוזה')
    await userEvent.type(screen.getByPlaceholderText('189'), '100')
    fireEvent.submit(screen.getByRole('button', { name: 'הוסף מוצר' }).closest('form')!)
    await waitFor(() => expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'מזוזה', price: 100 })
    ))
  })

  it('navigates to /admin after successful insert', async () => {
    render(<ProductForm />)
    await userEvent.type(screen.getByPlaceholderText(/חנוכייה ירושלמית/), 'מזוזה')
    await userEvent.type(screen.getByPlaceholderText('189'), '100')
    fireEvent.submit(screen.getByRole('button', { name: 'הוסף מוצר' }).closest('form')!)
    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith('/admin'))
  })

  it('displays error message on insert failure', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'DB error' } })
    render(<ProductForm />)
    await userEvent.type(screen.getByPlaceholderText(/חנוכייה ירושלמית/), 'מזוזה')
    await userEvent.type(screen.getByPlaceholderText('189'), '100')
    fireEvent.submit(screen.getByRole('button', { name: 'הוסף מוצר' }).closest('form')!)
    expect(await screen.findByText('DB error')).toBeInTheDocument()
  })

  it('shows URL input when toggle is clicked', async () => {
    render(<ProductForm />)
    fireEvent.click(screen.getByText(/או הזינו קישור URL/))
    expect(screen.getByPlaceholderText('https://...')).toBeInTheDocument()
  })

  it('hides URL input after second toggle click', async () => {
    render(<ProductForm />)
    fireEvent.click(screen.getByText(/או הזינו קישור URL/))
    fireEvent.click(screen.getByText('הסתר'))
    expect(screen.queryByPlaceholderText('https://...')).not.toBeInTheDocument()
  })

  it('shows upload error for non-image file', async () => {
    render(<ProductForm />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['content'], 'doc.pdf', { type: 'application/pdf' })
    Object.defineProperty(input, 'files', { value: [file], configurable: true })
    fireEvent.change(input)
    expect(await screen.findByText(/קובץ תמונה בלבד/)).toBeInTheDocument()
  })

  it('shows upload error for oversized file', async () => {
    render(<ProductForm />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const bigFile = new File(['x'], 'big.jpg', { type: 'image/jpeg' })
    Object.defineProperty(bigFile, 'size', { value: 6 * 1024 * 1024 })
    Object.defineProperty(input, 'files', { value: [bigFile], configurable: true })
    fireEvent.change(input)
    expect(await screen.findByText(/גודל הקובץ המקסימלי/)).toBeInTheDocument()
  })

  it('uploads file and sets image_url on success', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ url: 'https://cdn.example.com/img.jpg' }),
    })
    render(<ProductForm />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' })
    Object.defineProperty(input, 'files', { value: [file], configurable: true })
    fireEvent.change(input)
    expect(await screen.findByAltText('preview')).toHaveAttribute('src', 'https://cdn.example.com/img.jpg')
  })

  it('shows error when upload API returns non-ok response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Upload failed' }),
    })
    render(<ProductForm />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' })
    Object.defineProperty(input, 'files', { value: [file], configurable: true })
    fireEvent.change(input)
    expect(await screen.findByText(/שגיאה בהעלאה/)).toBeInTheDocument()
  })

  it('clears image preview when × button is clicked', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ url: 'https://cdn.example.com/img.jpg' }),
    })
    render(<ProductForm />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' })
    Object.defineProperty(input, 'files', { value: [file], configurable: true })
    fireEvent.change(input)
    await screen.findByAltText('preview')
    fireEvent.click(screen.getByText('×'))
    expect(screen.queryByAltText('preview')).not.toBeInTheDocument()
  })

  it('handles drag and drop of an image file', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ url: 'https://cdn.example.com/dropped.jpg' }),
    })
    render(<ProductForm />)
    const dropZone = document.querySelector('[style*="dashed"]') as HTMLElement
    fireEvent.dragOver(dropZone, { preventDefault: jest.fn() })
    const file = new File(['img'], 'drop.jpg', { type: 'image/jpeg' })
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    })
    expect(await screen.findByAltText('preview')).toBeInTheDocument()
  })

  it('navigates back on cancel click', () => {
    render(<ProductForm />)
    fireEvent.click(screen.getByRole('button', { name: 'ביטול' }))
    expect(mockRouterBack).toHaveBeenCalled()
  })
})

describe('ProductForm — edit product', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockEq.mockResolvedValue({ error: null })
    mockUpdate.mockReturnValue({ eq: mockEq })
  })

  it('calls supabase update (not insert) when editing', async () => {
    render(<ProductForm initial={{ id: 'p1', name: 'מנורה', price: '150' }} />)
    fireEvent.submit(screen.getByRole('button', { name: 'שמור שינויים' }).closest('form')!)
    await waitFor(() => expect(mockEq).toHaveBeenCalled())
    expect(mockInsert).not.toHaveBeenCalled()
  })
})
