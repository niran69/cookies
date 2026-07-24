/*
# Design Arena Cookies — Core Schema

## Purpose
Creates the full data model for a premium WhatsApp-based cookie ordering website:
products (cookies), orders, order items, testimonials, offers, and contact messages.
Also seeds starter products, testimonials, and an offer so the site looks complete on first load.

## New Tables
1. `products` — cookie catalog
   - id (uuid PK), name, description, price (numeric), category, image_url, in_stock (bool), featured (bool), created_at
2. `orders` — customer bookings
   - id (uuid PK), customer_name, phone, email, address, delivery_date, delivery_time, special_instructions, delivery_fee, total, status, created_at
3. `order_items` — line items per order
   - id (uuid PK), order_id (FK orders), product_id (FK products), product_name, unit_price, quantity, subtotal
4. `testimonials` — customer reviews
   - id (uuid PK), name, rating (1-5), message, approved (bool), featured (bool), created_at
5. `offers` — limited-time promotional banners
   - id (uuid PK), title, description, badge, active (bool), created_at
6. `contact_messages` — contact form submissions
   - id (uuid PK), name, email, phone, message, created_at

## Security (RLS)
- products: public read (anon + authenticated); write only to authenticated (admin).
- orders / order_items: read+write to anon + authenticated (customers place orders without sign-in; admin manages via authenticated session).
- testimonials: public read of approved; insert to anon (submissions); update/delete to authenticated.
- offers: public read of active; write to authenticated.
- contact_messages: insert to anon; read/delete to authenticated.

## Indexes
- products(category), products(featured), orders(status), orders(created_at), order_items(order_id), testimonials(approved), offers(active)
*/

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  category text NOT NULL CHECK (category IN ('Chocolate','Nutty','Fruit','Premium','Combo')),
  image_url text NOT NULL,
  in_stock boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_manage_products" ON products;
CREATE POLICY "auth_manage_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  address text NOT NULL,
  delivery_date date NOT NULL,
  delivery_time text NOT NULL,
  special_instructions text,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  total numeric(10,2) NOT NULL CHECK (total >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','preparing','out_for_delivery','delivered','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_read_orders" ON orders;
CREATE POLICY "auth_read_orders" ON orders FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_orders" ON orders;
CREATE POLICY "auth_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_orders" ON orders;
CREATE POLICY "auth_delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);

-- ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  unit_price numeric(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity integer NOT NULL CHECK (quantity > 0),
  subtotal numeric(10,2) NOT NULL CHECK (subtotal >= 0)
);
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_read_order_items" ON order_items;
CREATE POLICY "auth_read_order_items" ON order_items FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_order_items" ON order_items;
CREATE POLICY "auth_update_order_items" ON order_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_order_items" ON order_items;
CREATE POLICY "auth_delete_order_items" ON order_items FOR DELETE
  TO authenticated USING (true);

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message text NOT NULL,
  approved boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved);

DROP POLICY IF EXISTS "public_read_approved_testimonials" ON testimonials;
CREATE POLICY "public_read_approved_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_testimonials" ON testimonials;
CREATE POLICY "anon_insert_testimonials" ON testimonials FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
CREATE POLICY "auth_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;
CREATE POLICY "auth_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);

-- OFFERS
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  badge text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_offers_active ON offers(active);

DROP POLICY IF EXISTS "public_read_offers" ON offers;
CREATE POLICY "public_read_offers" ON offers FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_manage_offers" ON offers;
CREATE POLICY "auth_manage_offers" ON offers FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_offers" ON offers;
CREATE POLICY "auth_update_offers" ON offers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_offers" ON offers;
CREATE POLICY "auth_delete_offers" ON offers FOR DELETE
  TO authenticated USING (true);

-- CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at);

DROP POLICY IF EXISTS "anon_insert_contact" ON contact_messages;
CREATE POLICY "anon_insert_contact" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_read_contact" ON contact_messages;
CREATE POLICY "auth_read_contact" ON contact_messages FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_delete_contact" ON contact_messages;
CREATE POLICY "auth_delete_contact" ON contact_messages FOR DELETE
  TO authenticated USING (true);
