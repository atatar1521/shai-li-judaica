import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CartSidebar from '../CartSidebar'

const mockGetCart = jest.fn()
const mockRemoveFromCart = jest.fn()
const mockUpdateQuantity = jest.fn()
const mockBuildWhatsAppUrl = jest.fn().mockReturnValue('https://wa.me/test')

jest.mock('@/lib/cart', () => ({
  getCart: (...args: unknown[]) => mockGetCart(...args),
  removeFromCart: (...args: unknown[]) => mockRemoveFromCart(...args),
  updateQuantity: (...args: unknown[]) => mockUpdateQuantity(...args),
}))

jest.mock('@/lib/whatsapp', () => ({
  buildWhatsAppUrl: (...args: unknown[]) => mockBuildWhatsAppUrl(...args),
}))

const sampleItem = {
  id: 'p1',
  quantity: 2,
  product: { id: 'p1', name: 'מזוזה', price: 120, image_url: null, badge: null },
}

describe('CartSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetCart.mockResolvedValue([])
    mockRemoveFromCart.mockResolvedValue(undefined)
    mockUpdateQuantity.mockResolvedValue(undefined)
  })

  it('does not show cart content when closed', () => {
    render(<CartSidebar open={false} onClose={jest.fn()} />)
    expect(screen.queryByText('סל הקניות')).not.toBeInTheDocument()
  })

  it('shows cart header when open', async () => {
    render(<CartSidebar open={true} onClose={jest.fn()} />)
    expect(await screen.findByText(/סל הקניות/)).toBeInTheDocument()
  })

  it('shows empty state when cart is empty', async () => {
    mockGetCart.mockResolvedValue([])
    render(<CartSidebar open={true} onClose={jest.fn()} />)
    expect(await screen.findByText(/הסל ריק/)).toBeInTheDocument()
  })

  it('renders cart items when cart has products', async () => {
    mockGetCart.mockResolvedValue([sampleItem])
    render(<CartSidebar open={true} onClose={jest.fn()} />)
    expect(await screen.findByText('מזוזה')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = jest.fn()
    render(<CartSidebar open={true} onClose={onClose} />)
    await screen.findByText(/סל הקניות/)
    fireEvent.click(screen.getByText('×'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls removeFromCart when delete button is clicked', async () => {
    mockGetCart.mockResolvedValue([sampleItem])
    render(<CartSidebar open={true} onClose={jest.fn()} />)
    await screen.findByText('מזוזה')
    fireEvent.click(screen.getByText('🗑'))
    await waitFor(() => expect(mockRemoveFromCart).toHaveBeenCalledWith('p1'))
  })

  it('calls updateQuantity when + is clicked', async () => {
    mockGetCart.mockResolvedValue([sampleItem])
    render(<CartSidebar open={true} onClose={jest.fn()} />)
    await screen.findByText('מזוזה')
    fireEvent.click(screen.getByText('+'))
    await waitFor(() => expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 3))
  })

  it('calls updateQuantity when − is clicked', async () => {
    mockGetCart.mockResolvedValue([sampleItem])
    render(<CartSidebar open={true} onClose={jest.fn()} />)
    await screen.findByText('מזוזה')
    fireEvent.click(screen.getByText('−'))
    await waitFor(() => expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 1))
  })

  it('shows WhatsApp checkout link when items are present', async () => {
    mockGetCart.mockResolvedValue([sampleItem])
    render(<CartSidebar open={true} onClose={jest.fn()} />)
    await screen.findByText('מזוזה')
    expect(screen.getByRole('link', { name: /וואטסאפ/ })).toHaveAttribute('href', 'https://wa.me/test')
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = jest.fn()
    const { container } = render(<CartSidebar open={true} onClose={onClose} />)
    await screen.findByText(/סל הקניות/)
    // The backdrop div has zIndex 200 and position fixed
    const backdrop = Array.from(container.querySelectorAll('div'))
      .find(el => el.style.zIndex === '200' && el.style.position === 'fixed') as HTMLElement
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalled()
  })

  it('fires onMouseEnter and onMouseLeave on the WhatsApp link without error', async () => {
    mockGetCart.mockResolvedValue([sampleItem])
    render(<CartSidebar open={true} onClose={jest.fn()} />)
    await screen.findByText('מזוזה')
    const link = screen.getByRole('link', { name: /וואטסאפ/ })
    fireEvent.mouseEnter(link)
    fireEvent.mouseLeave(link)
    expect(link).toBeInTheDocument()
  })

  it('reloads cart when cart-updated event fires', async () => {
    mockGetCart.mockResolvedValue([])
    render(<CartSidebar open={true} onClose={jest.fn()} />)
    await screen.findByText(/הסל ריק/)
    mockGetCart.mockResolvedValue([sampleItem])
    window.dispatchEvent(new Event('cart-updated'))
    expect(await screen.findByText('מזוזה')).toBeInTheDocument()
  })
})
