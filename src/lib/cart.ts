export type CartItem = {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image_url: string | null
    badge: string | null
  }
}

const CART_KEY = 'cart'

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('cart-updated'))
}

export async function getCart(): Promise<CartItem[]> {
  return readCart()
}

export async function addToCart(product: CartItem['product']) {
  const items = readCart()
  const existing = items.find(i => i.id === product.id)
  if (existing) {
    existing.quantity += 1
  } else {
    items.push({ id: product.id, quantity: 1, product })
  }
  saveCart(items)
  return { error: null }
}

export async function removeFromCart(productId: string) {
  saveCart(readCart().filter(i => i.id !== productId))
}

export async function updateQuantity(productId: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(productId)
  } else {
    saveCart(readCart().map(i => i.id === productId ? { ...i, quantity } : i))
  }
}
