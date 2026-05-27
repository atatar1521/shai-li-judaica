import { render, screen } from '@testing-library/react'
import Home from '../page'

const mockFrom = jest.fn()

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(async () => ({
    from: mockFrom,
  })),
}))

jest.mock('@/components/Nav', () => ({
  __esModule: true,
  default: () => <nav data-testid="nav" />,
}))

jest.mock('@/components/Hero', () => ({
  __esModule: true,
  default: () => <section data-testid="hero" />,
}))

jest.mock('@/components/TrustBar', () => ({
  __esModule: true,
  default: () => <div data-testid="trust-bar" />,
}))

jest.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer" />,
}))

jest.mock('@/components/ProductCard', () => ({
  __esModule: true,
  default: ({ product }: { product: { name: string } }) => (
    <div data-testid="product-card">{product.name}</div>
  ),
}))

function setupMocks(products: object[] | null, categories: { name: string }[] | null) {
  mockFrom.mockImplementation((table: string) => {
    if (table === 'categories') {
      return {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: categories }),
      }
    }
    return {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: products }),
    }
  })
}

describe('Home page', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders Nav, Hero, TrustBar, and Footer', async () => {
    setupMocks([], [])
    const result = await Home()
    render(result as React.ReactElement)
    expect(screen.getByTestId('nav')).toBeInTheDocument()
    expect(screen.getByTestId('hero')).toBeInTheDocument()
    expect(screen.getByTestId('trust-bar')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('renders category cards from the database', async () => {
    setupMocks([], [
      { name: 'חנוכיות' },
      { name: 'מזוזות' },
      { name: 'תכשיטים' },
      { name: 'שבת וחגים' },
      { name: 'אמנות לבית' },
      { name: 'מתנות' },
    ])
    const result = await Home()
    render(result as React.ReactElement)
    expect(screen.getByText('חנוכיות')).toBeInTheDocument()
    expect(screen.getByText('מזוזות')).toBeInTheDocument()
    expect(screen.getByText('שבת וחגים')).toBeInTheDocument()
  })

  it('renders no category cards when categories are empty', async () => {
    setupMocks([], [])
    const result = await Home()
    render(result as React.ReactElement)
    expect(screen.queryByRole('link', { name: /חנוכיות/ })).not.toBeInTheDocument()
  })

  it('shows empty products state when there are no products', async () => {
    setupMocks([], [])
    const result = await Home()
    render(result as React.ReactElement)
    expect(screen.getByText('המוצרים יתווספו בקרוב')).toBeInTheDocument()
  })

  it('renders a ProductCard for each product', async () => {
    setupMocks([
      { id: 'p1', name: 'מזוזה', price: 120, description: null, category: null, image_url: null, badge: null, in_stock: true },
      { id: 'p2', name: 'חנוכייה', price: 250, description: null, category: null, image_url: null, badge: null, in_stock: true },
    ], [])
    const result = await Home()
    render(result as React.ReactElement)
    expect(screen.getAllByTestId('product-card')).toHaveLength(2)
    expect(screen.getByText('מזוזה')).toBeInTheDocument()
    expect(screen.getByText('חנוכייה')).toBeInTheDocument()
  })

  it('renders the about section', async () => {
    setupMocks([], [])
    const result = await Home()
    render(result as React.ReactElement)
    expect(screen.getByText(/שנים של אהבה/)).toBeInTheDocument()
  })

  it('renders the CTA contact section', async () => {
    setupMocks([], [])
    const result = await Home()
    render(result as React.ReactElement)
    expect(screen.getByText(/מחפשים מתנה מיוחדת/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /צרו קשר/ })).toBeInTheDocument()
  })
})
