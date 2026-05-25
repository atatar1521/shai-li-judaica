import { createClient } from '@/lib/supabase/client'

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

export async function getCart(): Promise<CartItem[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('basket_items')
    .select(`
      id,
      quantity,
      product:products (
        id,
        name,
        price,
        image_url,
        badge
      )
    `)
    .order('created_at', { ascending: true })

  return (data as unknown as CartItem[]) ?? []
}

export async function addToCart(productId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }

  // Check if already in cart
  const { data: existing } = await supabase
    .from('basket_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single()

  if (existing) {
    await supabase
      .from('basket_items')
      .update({ quantity: existing.quantity + 1 })
      .eq('id', existing.id)
  } else {
    await supabase
      .from('basket_items')
      .insert({ user_id: user.id, product_id: productId, quantity: 1 })
  }

  return { error: null }
}

export async function removeFromCart(itemId: string) {
  const supabase = createClient()
  await supabase.from('basket_items').delete().eq('id', itemId)
}

export async function updateQuantity(itemId: string, quantity: number) {
  const supabase = createClient()
  if (quantity <= 0) {
    await supabase.from('basket_items').delete().eq('id', itemId)
  } else {
    await supabase.from('basket_items').update({ quantity }).eq('id', itemId)
  }
}
