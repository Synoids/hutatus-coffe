'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, Product, CupSize, SugarLevel, IceLevel } from '@/lib/types'

interface AddItemOptions {
  size?: CupSize
  sugarLevel?: SugarLevel
  iceLevel?: IceLevel
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, options?: AddItemOptions) => void
  removeItem: (cartKey: string) => void
  updateQuantity: (cartKey: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'hutatus_coffee_cart_v2'

function resolvePrice(product: Product, size?: CupSize): number {
  if (!product.has_size_option || !size) return product.price
  if (size === 'small' && product.size_price_small) return product.size_price_small
  if (size === 'medium' && product.size_price_medium) return product.size_price_medium
  if (size === 'large' && product.size_price_large) return product.size_price_large
  return product.price
}

function buildCartKey(id: string, size?: CupSize, sugar?: SugarLevel, ice?: IceLevel): string {
  return `${id}__${size ?? 'none'}__${sugar ?? 'none'}__${ice ?? 'none'}`
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e)
    }
  }, [])

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, options?: AddItemOptions) => {
    const { size, sugarLevel, iceLevel } = options ?? {}
    const cartKey = buildCartKey(product.id, size, sugarLevel, iceLevel)
    const effectivePrice = resolvePrice(product, size)

    setItems((prev) => {
      const existing = prev.find((i) => i.cartKey === cartKey)
      if (existing) {
        return prev.map((i) =>
          i.cartKey === cartKey ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          cartKey,
          selectedSize: size,
          selectedSugar: sugarLevel,
          selectedIce: iceLevel,
          effectivePrice,
        },
      ]
    })
  }

  const removeItem = (cartKey: string) => {
    setItems((prev) => prev.filter((i) => i.cartKey !== cartKey))
  }

  const updateQuantity = (cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartKey)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.cartKey === cartKey ? { ...i, quantity } : i))
    )
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.effectivePrice * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
