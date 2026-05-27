import { render, screen } from '@testing-library/react'
import AdminPage from '../page'

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

jest.mock('../DeleteProductButton', () => ({
  __esModule: true,
  default: ({ name }: { name: string }) => <button>{`מחיקה ${name}`}</button>,
}))

function setupProducts(products: object[] | null) {
  mockFrom.mockReturnValue({
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockResolvedValue({ data: products }),
  })
}

describe('AdminPage', () => {
  beforeEach(() => jest.clearAllMocks())

  it('shows empty state when there are no products', async () => {
    setupProducts([])
    const result = await AdminPage()
    render(result as React.ReactElement)
    expect(screen.getByText('אין מוצרים עדיין')).toBeInTheDocument()
  })

  it('shows product count', async () => {
    setupProducts([
      { id: 'p1', name: 'מזוזה', price: 120, description: null, category: 'מזוזות', in_stock: true, badge: null },
    ])
    const result = await AdminPage()
    render(result as React.ReactElement)
    expect(screen.getByText(/1 מוצרים/)).toBeInTheDocument()
  })

  it('renders a table row for each product', async () => {
    setupProducts([
      { id: 'p1', name: 'מזוזה', price: 120, description: null, category: 'מזוזות', in_stock: true, badge: null },
      { id: 'p2', name: 'חנוכייה', price: 250, description: null, category: 'חנוכיות', in_stock: false, badge: 'מבצע' },
    ])
    const result = await AdminPage()
    render(result as React.ReactElement)
    expect(screen.getByText('מזוזה')).toBeInTheDocument()
    expect(screen.getByText('חנוכייה')).toBeInTheDocument()
  })

  it('shows out-of-stock badge for products not in stock', async () => {
    setupProducts([
      { id: 'p1', name: 'חנוכייה', price: 250, description: null, category: null, in_stock: false, badge: null },
    ])
    const result = await AdminPage()
    render(result as React.ReactElement)
    expect(screen.getByText('אזל')).toBeInTheDocument()
  })

  it('shows product badge when set', async () => {
    setupProducts([
      { id: 'p1', name: 'מנורה', price: 180, description: null, category: null, in_stock: true, badge: 'חדש' },
    ])
    const result = await AdminPage()
    render(result as React.ReactElement)
    expect(screen.getByText('חדש')).toBeInTheDocument()
  })

  it('renders add-product link', async () => {
    setupProducts([])
    const result = await AdminPage()
    render(result as React.ReactElement)
    expect(screen.getAllByRole('link', { name: /הוסף מוצר/ }).length).toBeGreaterThan(0)
  })
})
