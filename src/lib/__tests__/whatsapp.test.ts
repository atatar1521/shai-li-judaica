import { buildWhatsAppUrl } from '../whatsapp'
import type { CartItem } from '../cart'

const makeItem = (id: string, name: string, price: number, qty: number): CartItem => ({
  id,
  quantity: qty,
  product: { id, name, price, image_url: null, badge: null },
})

describe('buildWhatsAppUrl', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('uses fallback phone number when env var is not set', () => {
    delete process.env.NEXT_PUBLIC_WHATSAPP_PHONE
    const url = buildWhatsAppUrl([makeItem('1', 'מזוזה', 100, 1)])
    expect(url).toContain('https://wa.me/972500000000')
  })

  it('uses NEXT_PUBLIC_WHATSAPP_PHONE env var when set', () => {
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE = '972521234567'
    const url = buildWhatsAppUrl([makeItem('1', 'מזוזה', 100, 1)])
    expect(url).toContain('https://wa.me/972521234567')
  })

  it('uses יחידה (singular) for quantity of 1', () => {
    const url = buildWhatsAppUrl([makeItem('1', 'מזוזה', 100, 1)])
    expect(decodeURIComponent(url)).toContain('יחידה')
    expect(decodeURIComponent(url)).not.toContain('יחידות')
  })

  it('uses יחידות (plural) for quantity > 1', () => {
    const url = buildWhatsAppUrl([makeItem('1', 'מזוזה', 100, 3)])
    expect(decodeURIComponent(url)).toContain('יחידות')
  })

  it('calculates line total as price * quantity', () => {
    const url = buildWhatsAppUrl([makeItem('1', 'חנוכייה', 250, 2)])
    const decoded = decodeURIComponent(url)
    expect(decoded).toContain('500')
  })

  it('calculates grand total across multiple items', () => {
    const items = [
      makeItem('1', 'מזוזה', 100, 2),
      makeItem('2', 'חנוכייה', 300, 1),
    ]
    const decoded = decodeURIComponent(buildWhatsAppUrl(items))
    expect(decoded).toContain('500')
  })

  it('includes product name in the message', () => {
    const url = buildWhatsAppUrl([makeItem('1', 'מנורת שבת', 180, 1)])
    expect(decodeURIComponent(url)).toContain('מנורת שבת')
  })

  it('returns a properly encoded URL', () => {
    const url = buildWhatsAppUrl([makeItem('1', 'מזוזה', 100, 1)])
    expect(url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/)
  })

  it('handles an empty cart gracefully', () => {
    const url = buildWhatsAppUrl([])
    expect(url).toContain('https://wa.me/')
    expect(decodeURIComponent(url)).toContain('סה"כ')
  })
})
