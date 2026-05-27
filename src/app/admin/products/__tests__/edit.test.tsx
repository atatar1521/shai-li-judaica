import { render, screen } from '@testing-library/react'
import EditProductPage from '../edit/page'

const mockFrom = jest.fn()
const mockNotFound = jest.fn()

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(async () => ({
    from: mockFrom,
  })),
}))

jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

jest.mock('@/components/ProductForm', () => ({
  __esModule: true,
  default: ({ initial }: { initial?: { name?: string } }) => (
    <div data-testid="product-form">{initial?.name}</div>
  ),
}))

function setupProduct(product: object | null) {
  mockFrom.mockReturnValue({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: product }),
  })
}

describe('EditProductPage', () => {
  beforeEach(() => jest.clearAllMocks())

  it('calls notFound when no id param is provided', async () => {
    setupProduct(null)
    try {
      await EditProductPage({ searchParams: Promise.resolve({}) })
    } catch {}
    expect(mockNotFound).toHaveBeenCalled()
  })

  it('calls notFound when product is not found in database', async () => {
    setupProduct(null)
    try {
      await EditProductPage({ searchParams: Promise.resolve({ id: 'missing-id' }) })
    } catch {}
    expect(mockNotFound).toHaveBeenCalled()
  })

  it('renders ProductForm with product data when found', async () => {
    const product = { id: 'p1', name: 'מזוזה', price: 120, description: null, category: null, badge: null, in_stock: true, image_url: null }
    setupProduct(product)
    const result = await EditProductPage({ searchParams: Promise.resolve({ id: 'p1' }) })
    render(result as React.ReactElement)
    expect(screen.getByTestId('product-form')).toHaveTextContent('מזוזה')
  })

  it('renders back link to admin', async () => {
    const product = { id: 'p1', name: 'מזוזה', price: 120, description: null, category: null, badge: null, in_stock: true, image_url: null }
    setupProduct(product)
    const result = await EditProductPage({ searchParams: Promise.resolve({ id: 'p1' }) })
    render(result as React.ReactElement)
    expect(screen.getByRole('link', { name: /חזרה/ })).toHaveAttribute('href', '/admin')
  })
})
