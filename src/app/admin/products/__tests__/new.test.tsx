import { render, screen } from '@testing-library/react'
import NewProductPage from '../new/page'

const mockFrom = jest.fn()

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(async () => ({
    from: mockFrom,
  })),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

jest.mock('@/components/ProductForm', () => ({
  __esModule: true,
  default: ({ initial, categories }: { initial?: object; categories?: string[] }) => (
    <div data-testid="product-form" data-has-initial={!!initial} data-categories={JSON.stringify(categories)} />
  ),
}))

function setupCategories(categories: { name: string }[]) {
  mockFrom.mockReturnValue({
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockResolvedValue({ data: categories }),
  })
}

describe('NewProductPage', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders the page heading', async () => {
    setupCategories([])
    const result = await NewProductPage()
    render(result as React.ReactElement)
    expect(screen.getByText('הוספת מוצר חדש')).toBeInTheDocument()
  })

  it('renders ProductForm without initial data', async () => {
    setupCategories([])
    const result = await NewProductPage()
    render(result as React.ReactElement)
    const form = screen.getByTestId('product-form')
    expect(form).toBeInTheDocument()
    expect(form.getAttribute('data-has-initial')).toBe('false')
  })

  it('renders back link to admin', async () => {
    setupCategories([])
    const result = await NewProductPage()
    render(result as React.ReactElement)
    expect(screen.getByRole('link', { name: /חזרה/ })).toHaveAttribute('href', '/admin')
  })

  it('passes fetched categories to ProductForm', async () => {
    setupCategories([{ name: 'חנוכיות' }, { name: 'מזוזות' }])
    const result = await NewProductPage()
    render(result as React.ReactElement)
    const form = screen.getByTestId('product-form')
    expect(JSON.parse(form.getAttribute('data-categories')!)).toEqual(['חנוכיות', 'מזוזות'])
  })
})
