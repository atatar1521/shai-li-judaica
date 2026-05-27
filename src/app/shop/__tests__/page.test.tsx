import { render, screen } from '@testing-library/react'
import ShopPage from '../page'

const mockFrom = jest.fn()

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(async () => ({ from: mockFrom })),
}))

jest.mock('@/components/Nav', () => ({
  __esModule: true,
  default: () => <nav data-testid="nav" />,
}))

jest.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer" />,
}))

jest.mock('../ShopClient', () => ({
  __esModule: true,
  default: ({ products, categories, initialCategory }: {
    products: object[]
    categories: string[]
    initialCategory: string | null
  }) => (
    <div data-testid="shop-client">
      <span data-testid="product-count">{products.length}</span>
      <span data-testid="category-count">{categories.length}</span>
      {initialCategory && <span data-testid="initial-cat">{initialCategory}</span>}
    </div>
  ),
}))

function setupMocks(products: object[], categories: { name: string }[]) {
  mockFrom.mockImplementation((table: string) => {
    if (table === 'categories') {
      return {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: categories }),
      }
    }
    return {
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: products }),
    }
  })
}

describe('Shop page', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders Nav and Footer', async () => {
    setupMocks([], [])
    const result = await ShopPage({ searchParams: Promise.resolve({}) })
    render(result as React.ReactElement)
    expect(screen.getByTestId('nav')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('renders the page title', async () => {
    setupMocks([], [])
    const result = await ShopPage({ searchParams: Promise.resolve({}) })
    render(result as React.ReactElement)
    expect(screen.getByText('כל המוצרים')).toBeInTheDocument()
  })

  it('passes products and categories to ShopClient', async () => {
    const products = [
      { id: 'p1', name: 'מוצר', price: 100, category: 'נטלות', in_stock: true, badge: null, image_url: null, description: null },
    ]
    const categories = [{ name: 'נטלות' }, { name: 'קופות צדקה' }]
    setupMocks(products, categories)
    const result = await ShopPage({ searchParams: Promise.resolve({}) })
    render(result as React.ReactElement)
    expect(screen.getByTestId('product-count')).toHaveTextContent('1')
    expect(screen.getByTestId('category-count')).toHaveTextContent('2')
  })

  it('passes initialCategory from searchParams to ShopClient', async () => {
    setupMocks([], [{ name: 'נטלות' }])
    const result = await ShopPage({ searchParams: Promise.resolve({ cat: 'נטלות' }) })
    render(result as React.ReactElement)
    expect(screen.getByTestId('initial-cat')).toHaveTextContent('נטלות')
  })

  it('passes null initialCategory when no cat param', async () => {
    setupMocks([], [])
    const result = await ShopPage({ searchParams: Promise.resolve({}) })
    render(result as React.ReactElement)
    expect(screen.queryByTestId('initial-cat')).not.toBeInTheDocument()
  })

  it('renders back link to categories section', async () => {
    setupMocks([], [])
    const result = await ShopPage({ searchParams: Promise.resolve({}) })
    render(result as React.ReactElement)
    const backLink = screen.getByRole('link', { name: /כל הקטגוריות/ })
    expect(backLink).toHaveAttribute('href', '/#categories')
  })

  it('handles empty products gracefully', async () => {
    setupMocks([], [])
    const result = await ShopPage({ searchParams: Promise.resolve({}) })
    render(result as React.ReactElement)
    expect(screen.getByTestId('product-count')).toHaveTextContent('0')
  })
})
