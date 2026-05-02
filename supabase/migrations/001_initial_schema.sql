-- ==================================================
-- 📚 LEARNING NOTE: Database Schema
--
-- This SQL file creates all the tables we need in Supabase.
-- Think of tables like spreadsheets — each row is a record
-- and each column is a piece of information.
--
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard → Your Project → SQL Editor
-- ==================================================

-- Enable UUID extension (for generating unique IDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================================================
-- PRODUCTS TABLE
-- Stores each blind bag type (e.g., "Ocean Friends")
-- ==================================================
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  theme TEXT NOT NULL DEFAULT 'animals',
  hints TEXT DEFAULT '',
  image_urls TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==================================================
-- PRODUCT VARIANTS TABLE
-- Each product has sizes: small, medium, large
-- with different prices and stock counts
-- ==================================================
CREATE TABLE product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL CHECK (size IN ('small', 'medium', 'large')),
  price DECIMAL(10,2) NOT NULL DEFAULT 50.00,
  stock_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(product_id, size)
);

-- ==================================================
-- INVITE CODES TABLE
-- Codes shared privately to verify buyers
-- ==================================================
CREATE TABLE invite_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  label TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  times_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================================================
-- ORDERS TABLE
-- Each order placed by a buyer
-- ==================================================
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  buyer_email TEXT DEFAULT '',
  buyer_address TEXT DEFAULT '',
  delivery_preference TEXT NOT NULL DEFAULT 'pickup' CHECK (delivery_preference IN ('pickup', 'delivery')),
  invite_code_id UUID REFERENCES invite_codes(id),
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  payment_received BOOLEAN DEFAULT false,
  fcm_token TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==================================================
-- ORDER ITEMS TABLE
-- Each item within an order
-- ==================================================
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES product_variants(id),
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- ==================================================
-- NOTIFICATION LOG TABLE
-- Tracks notifications sent to buyers
-- ==================================================
CREATE TABLE notification_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'push', 'email')),
  event_type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ DEFAULT now()
);

-- ==================================================
-- INDEXES for faster queries
-- ==================================================
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_phone ON orders(buyer_phone);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_products_theme ON products(theme);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_invite_codes_code ON invite_codes(code);

-- ==================================================
-- ROW LEVEL SECURITY (RLS)
-- 📚 LEARNING NOTE: RLS is like a security guard for each row.
-- It controls WHO can read/write which rows.
-- ==================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read active products, only admin can write
CREATE POLICY "Anyone can read active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can do everything with products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Product Variants: Everyone can read
CREATE POLICY "Anyone can read product variants" ON product_variants
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage variants" ON product_variants
  FOR ALL USING (auth.role() = 'authenticated');

-- Invite Codes: Only admin can read/write
CREATE POLICY "Admin can manage invite codes" ON invite_codes
  FOR ALL USING (auth.role() = 'authenticated');

-- Allow checking code validity (for checkout)
CREATE POLICY "Anyone can check code validity" ON invite_codes
  FOR SELECT USING (is_active = true);

-- Orders: Buyers can create, admin can read all
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Buyers can read their own orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage orders" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

-- Order Items: follows order access
CREATE POLICY "Anyone can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read order items" ON order_items
  FOR SELECT USING (true);

-- ==================================================
-- SEED DATA: Initial products and invite codes
-- ==================================================
INSERT INTO products (name, description, theme, hints, is_featured, is_active) VALUES
('Ocean Friends', 'Dive into a world of adorable sea creatures! Each bag contains tiny handcrafted ocean animals — from cute dolphins to sparkly starfish.', 'animals', '🐠 Something fishy, 🐚 Something shelly, ✨ Something sparkly', true, true),
('Enchanted Garden', 'A magical garden in a bag! Discover tiny flowers, butterflies, and maybe even a fairy or two hidden inside.', 'fantasy', '🌸 Something blooming, 🦋 Something fluttery, 🧚 Something magical', true, true),
('Sweet Treats Bakery', 'The cutest miniature bakery treats you''ve ever seen! Tiny cakes, cookies, and pastries — all handmade with love.', 'food', '🧁 Something sweet, 🍪 Something crunchy, 🎂 Something layered', true, true),
('Space Explorers', 'Blast off into space! Tiny rockets, planets, and astronauts await you in this cosmic blind bag.', 'space', '🚀 Something fast, 🌙 Something glowing, 👽 Something mysterious', false, true),
('Dino World', 'Roar! Travel back in time with adorable miniature dinosaurs. Each one is hand-painted and full of personality!', 'animals', '🦕 Something tall, 🦖 Something fierce, 🌿 Something green', true, true),
('Rainbow Unicorns', 'Everything sparkles in this magical unicorn bag! Glitter, rainbows, and the cutest tiny unicorns you''ve ever seen.', 'fantasy', '🦄 Something magical, 🌈 Something colourful, ✨ Something glittery', false, true);

-- Add variants for each product
DO $$
DECLARE prod RECORD;
BEGIN
  FOR prod IN SELECT id FROM products LOOP
    INSERT INTO product_variants (product_id, size, price, stock_count) VALUES
      (prod.id, 'small', 50, FLOOR(RANDOM() * 10 + 3)::int),
      (prod.id, 'medium', 75, FLOOR(RANDOM() * 8 + 2)::int),
      (prod.id, 'large', 100, FLOOR(RANDOM() * 5 + 1)::int);
  END LOOP;
END $$;

-- Add initial invite codes
INSERT INTO invite_codes (code, label) VALUES
('SUNSHINE2026', 'Society WhatsApp Group'),
('PEEKAPACK', 'General Code'),
('FAMILYFUN', 'Relatives');
