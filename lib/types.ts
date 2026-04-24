// Shared TypeScript types across the application

export interface Product {
  id: string
  name: string
  price: number
  image_url: string
  created_at?: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface Customer {
  id: string
  name: string
  phone: string
  created_at?: string
}

export interface Order {
  id: string
  customer_id: string
  total_price: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  created_at?: string
  customers?: Customer
  order_items?: OrderItemWithProduct[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
}

export interface OrderItemWithProduct extends OrderItem {
  products?: Product
}
