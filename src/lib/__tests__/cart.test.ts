/**
 * @jest-environment jsdom
 */
import { getCart, addToCart, removeFromCart, updateQuantity } from '../cart'

const mockProduct = {
  id: 'p1',
  name: 'מזוזה',
  price: 120,
  image_url: null,
  badge: null,
}

const mockProduct2 = {
  id: 'p2',
  name: 'חנוכייה',
  price: 250,
  image_url: 'http://example.com/img.jpg',
  badge: 'חדש',
}

let storage: Record<string, string> = {}

beforeEach(() => {
  storage = {}
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => storage[key] ?? null)
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { storage[key] = value })
  jest.spyOn(window, 'dispatchEvent').mockImplementation(() => true)
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('getCart', () => {
  it('returns empty array when cart is empty', async () => {
    expect(await getCart()).toEqual([])
  })

  it('returns parsed cart items from localStorage', async () => {
    storage['cart'] = JSON.stringify([{ id: 'p1', quantity: 2, product: mockProduct }])
    const items = await getCart()
    expect(items).toHaveLength(1)
    expect(items[0].id).toBe('p1')
    expect(items[0].quantity).toBe(2)
  })

  it('returns empty array when localStorage contains malformed JSON', async () => {
    storage['cart'] = 'not-valid-json{'
    expect(await getCart()).toEqual([])
  })
})

describe('addToCart', () => {
  it('adds a new product as a cart item with quantity 1', async () => {
    await addToCart(mockProduct)
    const items = await getCart()
    expect(items).toHaveLength(1)
    expect(items[0]).toEqual({ id: 'p1', quantity: 1, product: mockProduct })
  })

  it('increments quantity when the same product is added again', async () => {
    await addToCart(mockProduct)
    await addToCart(mockProduct)
    const items = await getCart()
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(2)
  })

  it('adds a second distinct product without touching the first', async () => {
    await addToCart(mockProduct)
    await addToCart(mockProduct2)
    const items = await getCart()
    expect(items).toHaveLength(2)
  })

  it('returns { error: null }', async () => {
    const result = await addToCart(mockProduct)
    expect(result).toEqual({ error: null })
  })

  it('dispatches cart-updated event', async () => {
    await addToCart(mockProduct)
    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(Event))
  })
})

describe('removeFromCart', () => {
  beforeEach(async () => {
    await addToCart(mockProduct)
    await addToCart(mockProduct2)
  })

  it('removes a product by id', async () => {
    await removeFromCart('p1')
    const items = await getCart()
    expect(items.find(i => i.id === 'p1')).toBeUndefined()
    expect(items.find(i => i.id === 'p2')).toBeDefined()
  })

  it('leaves cart unchanged when id does not exist', async () => {
    await removeFromCart('non-existent')
    expect(await getCart()).toHaveLength(2)
  })

  it('dispatches cart-updated event', async () => {
    ;(window.dispatchEvent as jest.Mock).mockClear()
    await removeFromCart('p1')
    expect(window.dispatchEvent).toHaveBeenCalled()
  })
})

describe('updateQuantity', () => {
  beforeEach(async () => {
    await addToCart(mockProduct)
  })

  it('updates quantity to a new positive value', async () => {
    await updateQuantity('p1', 5)
    const items = await getCart()
    expect(items[0].quantity).toBe(5)
  })

  it('removes the item when quantity is 0', async () => {
    await updateQuantity('p1', 0)
    expect(await getCart()).toHaveLength(0)
  })

  it('removes the item when quantity is negative', async () => {
    await updateQuantity('p1', -1)
    expect(await getCart()).toHaveLength(0)
  })
})
