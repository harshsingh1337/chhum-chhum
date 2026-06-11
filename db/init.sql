-- ChhumChhum Database Schema
-- Run via InsForge dashboard SQL editor or as Docker init script

-- ═══════════════════════════════════
-- TABLES
-- ═══════════════════════════════════

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'ChhumChhum',
  price INTEGER NOT NULL, -- in paise (2550000 = ₹25,500)
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  dimensions TEXT,
  care_instructions TEXT,
  customisation_info TEXT,
  fabric TEXT,
  occasion TEXT[] DEFAULT '{}',
  color_class_1 TEXT DEFAULT 'saree-a',
  color_class_2 TEXT DEFAULT 'saree-f',
  tag TEXT, -- 'Best Seller', 'New', 'Custom', NULL
  availability TEXT DEFAULT 'ready' CHECK (availability IN ('ready', 'made_to_order')),
  sizes TEXT[] DEFAULT ARRAY['None','XXS','XS','S','M','L','XL','XXL'],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color_class TEXT DEFAULT 'saree-a',
  product_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  default_address JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_name TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  subtotal INTEGER DEFAULT 0,
  tax_amount INTEGER DEFAULT 0,
  shipping_amount INTEGER DEFAULT 0,
  total_amount INTEGER DEFAULT 0,
  discount_code TEXT,
  discount_amount INTEGER DEFAULT 0,
  notes TEXT,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  size TEXT DEFAULT 'None',
  quantity INTEGER DEFAULT 1,
  unit_price INTEGER NOT NULL -- paise
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_fabric ON products(fabric);
CREATE INDEX IF NOT EXISTS idx_products_tag ON products(tag);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);

-- ═══════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Products: public read for active, admin full CRUD
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'project_admin');

-- Product Images: public read, admin full CRUD
CREATE POLICY "Public can view product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Admin full access product_images" ON product_images FOR ALL USING (auth.role() = 'project_admin');

-- Collections: public read for active, admin full CRUD
CREATE POLICY "Public can view active collections" ON collections FOR SELECT USING (is_active = true);
CREATE POLICY "Admin full access collections" ON collections FOR ALL USING (auth.role() = 'project_admin');

-- Orders: authenticated can view own, admin full CRUD
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (customer_email = auth.email());
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (auth.role() = 'project_admin');

-- Order Items: linked to order access
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.customer_email = auth.email())
);
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access order_items" ON order_items FOR ALL USING (auth.role() = 'project_admin');

-- Customers: own data, admin full
CREATE POLICY "Users can view own customer data" ON customers FOR SELECT USING (email = auth.email());
CREATE POLICY "Admin full access customers" ON customers FOR ALL USING (auth.role() = 'project_admin');

-- Site Settings: public read, admin write
CREATE POLICY "Public can view settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin full access settings" ON site_settings FOR ALL USING (auth.role() = 'project_admin');

-- ═══════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════

-- Collections
INSERT INTO collections (name, slug, color_class, product_count, sort_order) VALUES
  ('Organza', 'organza', 'saree-a', 32, 1),
  ('Haldi Series', 'haldi-series', 'saree-b', 18, 2),
  ('Bridal Edit', 'bridal-edit', 'saree-g', 24, 3),
  ('Chinon Silk', 'chinon-silk', 'saree-d', 41, 4)
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO products (name, brand, price, slug, description, dimensions, care_instructions, customisation_info, fabric, occasion, color_class_1, color_class_2, tag, availability) VALUES
  ('Rose-Pink Organza Saree', 'Picchika', 2550000, 'rose-pink-organza', 'Hand painted Rose-Pink organza saree with hand painted red roses. Enhanced with hand embroidered gota. Comes with an unstitched silk piece in the shade of saree.', 'Length of saree: 5.5 meters\nWidth of saree: 41" / 42" inches\nLength of blouse piece: 1 meter', 'Dry clean only. Store in a muslin bag. Avoid direct sunlight for extended periods.', 'For customisations WhatsApp: +91 88904 34749 / 93588 40141', 'Organza', ARRAY['Wedding','Festive'], 'saree-a', 'saree-f', 'Best Seller', 'ready'),
  ('Ahi — Pastel Dreams', 'ChhumChhum', 2550000, 'ahi-pastel-dreams', 'Delicate pastel organza with hand-painted floral motifs.', 'Length: 5.5m, Width: 42"', 'Dry clean only.', 'WhatsApp: +91 88904 34749', 'Organza', ARRAY['Party Wear','Festive'], 'saree-b', 'saree-e', NULL, 'ready'),
  ('Fuschia on Red', 'ChhumChhum', 2550000, 'fuschia-on-red', 'Celebrity-approved fuschia and red organza masterpiece.', 'Length: 5.5m, Width: 42"', 'Dry clean only.', 'WhatsApp: +91 88904 34749', 'Organza', ARRAY['Wedding','Party Wear'], 'saree-c', 'saree-g', 'New', 'ready'),
  ('Lilac Reverie', 'ChhumChhum', 2750000, 'lilac-reverie', 'Dreamy lilac tones on pure organza with delicate embroidery.', 'Length: 5.5m, Width: 42"', 'Dry clean only.', 'WhatsApp: +91 88904 34749', 'Organza', ARRAY['Festive'], 'saree-d', 'saree-h', NULL, 'ready'),
  ('The Dreamy Pastel', 'ChhumChhum', 3350000, 'dreamy-pastel', 'A dreamy combination of pastel shades on premium organza.', 'Length: 5.5m, Width: 42"', 'Dry clean only.', 'WhatsApp: +91 88904 34749', 'Organza', ARRAY['Haldi','Festive'], 'saree-d', 'saree-h', NULL, 'made_to_order'),
  ('Rose Pink Painted Border', 'ChhumChhum', 2750000, 'rose-pink-painted-border', 'Beautiful rose pink saree with hand-painted border work.', 'Length: 5.5m, Width: 42"', 'Dry clean only.', 'WhatsApp: +91 88904 34749', 'Diamond Chiffon', ARRAY['Party Wear'], 'saree-e', 'saree-a', NULL, 'ready'),
  ('Lilies on Rosepink', 'ChhumChhum', 2550000, 'lilies-on-rosepink', 'Elegant lily motifs on a rosepink base.', 'Length: 5.5m, Width: 42"', 'Dry clean only.', 'WhatsApp: +91 88904 34749', 'Organza', ARRAY['Wedding','Festive'], 'saree-g', 'saree-c', NULL, 'ready'),
  ('Custom Name Organza', 'ChhumChhum', 3150000, 'custom-name-organza', 'Personalized organza with your name hand-painted.', 'Length: 5.5m, Width: 42"', 'Dry clean only.', 'WhatsApp: +91 88904 34749', 'Organza', ARRAY['Wedding'], 'saree-h', 'saree-b', 'Custom', 'made_to_order'),
  ('Mauve Whisper Chinon', 'ChhumChhum', 2950000, 'mauve-whisper-chinon', 'Subtle mauve chinon with whisper-light embroidery.', 'Length: 5.5m, Width: 42"', 'Dry clean only.', 'WhatsApp: +91 88904 34749', 'Chinon', ARRAY['Party Wear','Festive'], 'saree-f', 'saree-d', NULL, 'ready'),
  ('Ivory Gota Silk', 'ChhumChhum', 3400000, 'ivory-gota-silk', 'Premium ivory silk with intricate gota patti work.', 'Length: 5.5m, Width: 42"', 'Dry clean only.', 'WhatsApp: +91 88904 34749', 'Pure Silk', ARRAY['Wedding','Festive'], 'saree-b', 'saree-f', NULL, 'made_to_order')
ON CONFLICT (slug) DO NOTHING;

-- Site Settings
INSERT INTO site_settings (key, value) VALUES
  ('store_address', '"29 B, South End Park, Kolkata, West Bengal 700029"'),
  ('contact_email', '"hello@chhumchhum.com"'),
  ('contact_phone', '"+91 99034 84121"'),
  ('marquee_items', '["Hand Painted Sarees","Luxury Organza","Made to Order","Celebrity Approved","Bridal Couture","Haldi Collection"]')
ON CONFLICT (key) DO NOTHING;
