// Shared TypeScript types across the application

export type ProductCategory = 'coffee' | 'non-coffee' | 'dessert' | 'snack' | 'other'
export type CupSize = 'small' | 'medium' | 'large'
export type SugarLevel = 'no-sugar' | 'less-sugar' | 'normal-sugar' | 'sweet'
export type IceLevel = 'hot' | 'less-ice' | 'normal-ice'

export interface Product {
  id: string
  name: string
  price: number
  image_url: string
  category: ProductCategory
  has_size_option: boolean
  has_sugar_option: boolean
  has_ice_option: boolean
  size_price_small?: number | null
  size_price_medium?: number | null
  size_price_large?: number | null
  created_at?: string
}

// Unique key per cart variation: id + size + sugar + ice
export interface CartItem extends Product {
  quantity: number
  cartKey: string         // composite key: `${id}-${size}-${sugar}-${ice}`
  selectedSize?: CupSize
  selectedSugar?: SugarLevel
  selectedIce?: IceLevel
  effectivePrice: number  // resolved price from size or base price
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
  payment_method?: 'cash' | 'transfer'
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
  size?: CupSize
  sugar_level?: SugarLevel
  ice_level?: IceLevel
}

export interface OrderItemWithProduct extends OrderItem {
  products?: Product
}

// Label helpers
export const SIZE_LABELS: Record<CupSize, string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
}

export const SUGAR_LABELS: Record<SugarLevel, string> = {
  'no-sugar': 'Tanpa Gula',
  'less-sugar': 'Sedikit Gula',
  'normal-sugar': 'Normal',
  'sweet': 'Manis',
}

export const ICE_LABELS: Record<IceLevel, string> = {
  'hot': '🔥 Hot',
  'less-ice': '🧊 Less Ice',
  'normal-ice': '🧊 Normal Ice',
}
