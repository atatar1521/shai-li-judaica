import type { CartItem } from './cart'

export function buildWhatsAppUrl(items: CartItem[]): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? '972500000000'

  const lines = items.map(i => {
    const lineTotal = (i.product.price * i.quantity).toLocaleString('he-IL')
    const unit = i.quantity === 1 ? 'יחידה' : 'יחידות'
    return `${i.product.name} — ₪${lineTotal} (${i.quantity} ${unit})`
  })

  const total = items
    .reduce((sum, i) => sum + i.product.price * i.quantity, 0)
    .toLocaleString('he-IL')

  const message = [
    'שלום! הגעתי מהאתר שי לי יודאיקה',
    'אשמח לרכוש את הפריטים הבאים:',
    '',
    ...lines,
    '',
    `סה"כ: ₪${total}`,
    '',
    'אשמח לתאם את ההזמנה, ניתן ליצור איתי קשר?',
  ].join('\n')

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
