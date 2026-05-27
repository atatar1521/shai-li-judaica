import { render, screen, fireEvent } from '@testing-library/react'
import ShopClient from '../ShopClient'

jest.mock('@/components/ProductCard', () => ({
  __esModule: true,
  default: ({ product }: { product: { name: string } }) => (
    <div data-testid="product-card">{product.name}</div>
  ),
}))

const makeProduct = (overrides: object = {}) => ({
  id: 'p1',
  name: 'מוצר בדיקה',
  description: null,
  price: 100,
  category: 'נטלות',
  image_url: null,
  badge: null,
  in_stock: true,
  ...overrides,
})

const CATEGORIES = ['נטלות', 'קופות צדקה', 'שבת וחגים']

describe('ShopClient', () => {
  it('renders all products when no filter is active', () => {
    const products = [
      makeProduct({ id: 'p1', name: 'מוצר א', category: 'נטלות' }),
      makeProduct({ id: 'p2', name: 'מוצר ב', category: 'קופות צדקה' }),
    ]
    render(<ShopClient products={products} categories={CATEGORIES} initialCategory={null} />)
    expect(screen.getAllByTestId('product-card')).toHaveLength(2)
  })

  it('pre-selects initialCategory and filters products', () => {
    const products = [
      makeProduct({ id: 'p1', name: 'נטלה', category: 'נטלות' }),
      makeProduct({ id: 'p2', name: 'קופה', category: 'קופות צדקה' }),
    ]
    render(<ShopClient products={products} categories={CATEGORIES} initialCategory="נטלות" />)
    expect(screen.getAllByTestId('product-card')).toHaveLength(1)
    expect(screen.getByText('נטלה')).toBeInTheDocument()
  })

  it('shows all products when הכל chip is clicked after a category is selected', () => {
    const products = [
      makeProduct({ id: 'p1', name: 'נטלה', category: 'נטלות' }),
      makeProduct({ id: 'p2', name: 'קופה', category: 'קופות צדקה' }),
    ]
    render(<ShopClient products={products} categories={CATEGORIES} initialCategory="נטלות" />)
    fireEvent.click(screen.getByRole('button', { name: 'הכל' }))
    expect(screen.getAllByTestId('product-card')).toHaveLength(2)
  })

  it('allows selecting multiple categories', () => {
    const products = [
      makeProduct({ id: 'p1', name: 'נטלה', category: 'נטלות' }),
      makeProduct({ id: 'p2', name: 'קופה', category: 'קופות צדקה' }),
      makeProduct({ id: 'p3', name: 'שבת', category: 'שבת וחגים' }),
    ]
    render(<ShopClient products={products} categories={CATEGORIES} initialCategory={null} />)
    fireEvent.click(screen.getByRole('button', { name: 'נטלות' }))
    fireEvent.click(screen.getByRole('button', { name: 'קופות צדקה' }))
    expect(screen.getAllByTestId('product-card')).toHaveLength(2)
  })

  it('deselects a category chip when clicked again', () => {
    const products = [
      makeProduct({ id: 'p1', name: 'נטלה', category: 'נטלות' }),
      makeProduct({ id: 'p2', name: 'קופה', category: 'קופות צדקה' }),
    ]
    render(<ShopClient products={products} categories={CATEGORIES} initialCategory="נטלות" />)
    fireEvent.click(screen.getByRole('button', { name: 'נטלות' }))
    expect(screen.getAllByTestId('product-card')).toHaveLength(2)
  })

  it('shows results count', () => {
    const products = [
      makeProduct({ id: 'p1' }),
      makeProduct({ id: 'p2' }),
    ]
    render(<ShopClient products={products} categories={CATEGORIES} initialCategory={null} />)
    expect(screen.getByText('2 מוצרים')).toBeInTheDocument()
  })

  it('filters by in-stock only when toggle is checked', () => {
    const products = [
      makeProduct({ id: 'p1', name: 'במלאי', in_stock: true }),
      makeProduct({ id: 'p2', name: 'אזל', in_stock: false }),
    ]
    render(<ShopClient products={products} categories={CATEGORIES} initialCategory={null} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(screen.getAllByTestId('product-card')).toHaveLength(1)
    expect(screen.getByText('במלאי')).toBeInTheDocument()
  })

  it('filters by badge chip', () => {
    const products = [
      makeProduct({ id: 'p1', name: 'מוצר מתויג', badge: 'חדש' }),
      makeProduct({ id: 'p2', name: 'ללא תג', badge: null }),
    ]
    render(<ShopClient products={products} categories={CATEGORIES} initialCategory={null} />)
    fireEvent.click(screen.getByRole('button', { name: 'חדש' }))
    expect(screen.getAllByTestId('product-card')).toHaveLength(1)
    expect(screen.getByText('מוצר מתויג')).toBeInTheDocument()
  })

  it('clears badge filter when כל התגים is clicked', () => {
    const products = [
      makeProduct({ id: 'p1', name: 'מוצר א', badge: 'חדש' }),
      makeProduct({ id: 'p2', name: 'מוצר ב', badge: 'מבצע' }),
    ]
    render(<ShopClient products={products} categories={CATEGORIES} initialCategory={null} />)
    fireEvent.click(screen.getByRole('button', { name: 'חדש' }))
    fireEvent.click(screen.getByRole('button', { name: 'כל התגים' }))
    expect(screen.getAllByTestId('product-card')).toHaveLength(2)
  })

  it('sorts products by price ascending', () => {
    const products = [
      makeProduct({ id: 'p1', name: 'יקר', price: 300 }),
      makeProduct({ id: 'p2', name: 'זול', price: 50 }),
    ]
    render(<ShopClient products={products} categories={CATEGORIES} initialCategory={null} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'price-asc' } })
    const cards = screen.getAllByTestId('product-card')
    expect(cards[0]).toHaveTextContent('זול')
    expect(cards[1]).toHaveTextContent('יקר')
  })

  it('sorts products by price descending', () => {
    const products = [
      makeProduct({ id: 'p1', name: 'זול', price: 50 }),
      makeProduct({ id: 'p2', name: 'יקר', price: 300 }),
    ]
    render(<ShopClient products={products} categories={CATEGORIES} initialCategory={null} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'price-desc' } })
    const cards = screen.getAllByTestId('product-card')
    expect(cards[0]).toHaveTextContent('יקר')
    expect(cards[1]).toHaveTextContent('זול')
  })

  it('shows empty state when no products match filters', () => {
    const products = [makeProduct({ id: 'p1', category: 'נטלות' })]
    render(<ShopClient products={products} categories={CATEGORIES} initialCategory="קופות צדקה" />)
    expect(screen.getByText(/לא נמצאו מוצרים/)).toBeInTheDocument()
  })

  it('clears all filters when נקה הכל is clicked', () => {
    const products = [
      makeProduct({ id: 'p1', name: 'נטלה', category: 'נטלות' }),
      makeProduct({ id: 'p2', name: 'קופה', category: 'קופות צדקה' }),
    ]
    render(<ShopClient products={products} categories={CATEGORIES} initialCategory="נטלות" />)
    expect(screen.getAllByTestId('product-card')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: /נקה הכל/ }))
    expect(screen.getAllByTestId('product-card')).toHaveLength(2)
  })

  it('renders category chips for each category', () => {
    render(<ShopClient products={[]} categories={CATEGORIES} initialCategory={null} />)
    CATEGORIES.forEach(cat => {
      expect(screen.getByRole('button', { name: cat })).toBeInTheDocument()
    })
  })

  it('renders הכל chip that is active when no category is selected', () => {
    render(<ShopClient products={[]} categories={CATEGORIES} initialCategory={null} />)
    const allChip = screen.getByRole('button', { name: 'הכל' })
    expect(allChip).toHaveClass('active')
  })
})
