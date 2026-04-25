-- =============================================
-- Hutatus Coffee — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- =============================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price NUMERIC(12, 0) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'other'
    CHECK (category IN ('coffee', 'non-coffee', 'dessert', 'snack', 'other')),
  has_size_option BOOLEAN NOT NULL DEFAULT false,
  has_sugar_option BOOLEAN NOT NULL DEFAULT false,
  has_ice_option BOOLEAN NOT NULL DEFAULT false,
  size_price_small NUMERIC(12, 0),
  size_price_medium NUMERIC(12, 0),
  size_price_large NUMERIC(12, 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CUSTOMERS TABLE
-- UNIQUE constraint on phone enables upsert without duplicates
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  total_price NUMERIC(12, 0) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  payment_method TEXT DEFAULT 'cash'
    CHECK (payment_method IN ('cash', 'transfer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ORDER_ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(12, 0) NOT NULL,
  size TEXT CHECK (size IN ('small', 'medium', 'large')),
  sugar_level TEXT CHECK (sugar_level IN ('no-sugar', 'less-sugar', 'normal-sugar', 'sweet')),
  ice_level TEXT CHECK (ice_level IN ('hot', 'less-ice', 'normal-ice'))
);

-- =============================================
-- MIGRATION: Add new columns to existing tables
-- Run ONLY if you already have existing tables
-- =============================================
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'other'
    CHECK (category IN ('coffee', 'non-coffee', 'dessert', 'snack', 'other')),
  ADD COLUMN IF NOT EXISTS has_size_option BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_sugar_option BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_ice_option BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS size_price_small NUMERIC(12, 0),
  ADD COLUMN IF NOT EXISTS size_price_medium NUMERIC(12, 0),
  ADD COLUMN IF NOT EXISTS size_price_large NUMERIC(12, 0);

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cash'
    CHECK (payment_method IN ('cash', 'transfer'));

ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS size TEXT CHECK (size IN ('small', 'medium', 'large')),
  ADD COLUMN IF NOT EXISTS sugar_level TEXT CHECK (sugar_level IN ('no-sugar', 'less-sugar', 'normal-sugar', 'sweet')),
  ADD COLUMN IF NOT EXISTS ice_level TEXT CHECK (ice_level IN ('hot', 'less-ice', 'normal-ice'));

-- =============================================
-- SAMPLE SEED DATA (Optional — for testing)
-- =============================================
INSERT INTO products (name, price, image_url, category, has_size_option, has_sugar_option, has_ice_option, size_price_small, size_price_medium, size_price_large) VALUES
  ('Hutatus Signature Espresso', 35000, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=500', 'coffee', true, true, true, 30000, 35000, 42000),
  ('Caramel Macchiato', 45000, 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=500', 'coffee', true, true, true, 38000, 45000, 52000),
  ('Cold Brew Reserve', 40000, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=500', 'coffee', true, true, true, 35000, 40000, 48000),
  ('Matcha Latte', 48000, 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&q=80&w=500', 'non-coffee', true, true, true, 42000, 48000, 55000),
  ('Vanilla Flat White', 42000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=500', 'coffee', true, true, true, 36000, 42000, 49000),
  ('Hazelnut Cappuccino', 43000, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=500', 'coffee', true, true, true, 37000, 43000, 50000),
  ('Cheesecake Slice', 35000, 'https://images.unsplash.com/photo-1533134242453-0a9c4a95df26?auto=format&fit=crop&q=80&w=500', 'dessert', false, false, false, null, null, null),
  ('Croissant Butter', 28000, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=500', 'snack', false, false, false, null, null, null)
ON CONFLICT DO NOTHING;
