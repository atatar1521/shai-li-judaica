import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import ProductCard from '../ProductCard'

const mockAddToCart = jest.fn().mockResolvedValue({ error: null })
jest.mock('@/lib/cart', () => ({
  addToCart: (...args: unknown[]) => mockAddToCart(...args),
}))

const baseProduct = {
  id: 'p1',
  name: 'מזוזה מעוצבת',
  description: 'מזוזה יפהפייה לדלת הבית',
  price: 120,
  category: 'מזוזות',
  image_url: null,
  badge: null,
  in_stock: true,
}

describe('ProductCard', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders the product name', () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByText('מזוזה מעוצבת')).toBeInTheDocument()
  })

  it('renders the product price', () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByText(/120/)).toBeInTheDocument()
  })

  it('renders a badge when provided', () => {
    render(<ProductCard product={{ ...baseProduct, badge: 'מבצע' }} />)
    expect(screen.getByText('מבצע')).toBeInTheDocument()
  })

  it('does not render badge div when badge is null', () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.queryByText('מבצע')).not.toBeInTheDocument()
  })

  it('renders an out-of-stock badge when not in stock', () => {
    render(<ProductCard product={{ ...baseProduct, in_stock: false }} />)
    expect(screen.getByText('אזל')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByText('מזוזה יפהפייה לדלת הבית')).toBeInTheDocument()
  })

  it('renders the product image when image_url is set', () => {
    render(<ProductCard product={{ ...baseProduct, image_url: 'http://img.test/1.jpg' }} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', 'http://img.test/1.jpg')
  })

  it('add-to-cart button calls addToCart and shows confirmation', async () => {
    render(<ProductCard product={baseProduct} />)
    const btn = screen.getByRole('button', { name: /סל/ })
    fireEvent.click(btn)
    await waitFor(() => expect(mockAddToCart).toHaveBeenCalledWith({
      id: 'p1',
      name: 'מזוזה מעוצבת',
      price: 120,
      image_url: null,
      badge: null,
    }))
    expect(await screen.findByText(/נוסף/)).toBeInTheDocument()
  })

  it('button is disabled when out of stock', () => {
    render(<ProductCard product={{ ...baseProduct, in_stock: false }} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('does not call addToCart when out of stock', () => {
    render(<ProductCard product={{ ...baseProduct, in_stock: false }} />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockAddToCart).not.toHaveBeenCalled()
  })

  it('resets button text back after 2 seconds', async () => {
    jest.useFakeTimers()
    render(<ProductCard product={baseProduct} />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(mockAddToCart).toHaveBeenCalled())
    act(() => jest.advanceTimersByTime(2001))
    await waitFor(() => expect(screen.getByRole('button')).toHaveTextContent('+ סל'))
    jest.useRealTimers()
  })
})
