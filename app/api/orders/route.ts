import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customer, items, total_price } = body

    // 1. Validate input
    if (!customer?.name || !customer?.phone || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    // 2. Insert customer (upsert by phone to avoid duplicates)
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .upsert(
        { name: customer.name, phone: customer.phone },
        { onConflict: 'phone', ignoreDuplicates: false }
      )
      .select()
      .single()

    if (customerError) {
      console.error('Customer error details:', customerError)
      return NextResponse.json({ error: 'Failed to save customer.', details: customerError.message }, { status: 500 })
    }

    // 3. Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerData.id,
        total_price,
        status: 'pending',
        payment_method: body.payment_method || 'cash',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order error details:', orderError)
      return NextResponse.json({ error: 'Failed to create order.', details: orderError.message }, { status: 500 })
    }

    // 4. Insert order items (with size, sugar_level, ice_level)
    const orderItems = items.map((item: {
      product_id: string
      quantity: number
      price: number
      size?: string | null
      sugar_level?: string | null
      ice_level?: string | null
    }) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      size: item.size ?? null,
      sugar_level: item.sugar_level ?? null,
      ice_level: item.ice_level ?? null,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

    if (itemsError) {
      console.error('Order items error:', itemsError)
      return NextResponse.json({ error: 'Failed to save order items.' }, { status: 500 })
    }

    return NextResponse.json({ orderId: orderData.id }, { status: 201 })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
