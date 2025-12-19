-- ============================================
-- ASTRO BRAND TEMPLATE - SUPABASE SCHEMA
-- ============================================
-- Complete database schema for products, purchases, and downloads
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PRODUCTS TABLE
-- ============================================
-- Stores all products (both services and PDF downloads)

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Product type and metadata
  product_type TEXT NOT NULL CHECK (product_type IN ('service', 'pdf_download')),
  category TEXT,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,

  -- Images
  image TEXT,
  thumbnail TEXT,

  -- Service-specific fields
  service_type TEXT CHECK (service_type IN ('one-time', 'subscription', 'consultation')),
  duration TEXT,
  delivery_time TEXT,
  includes TEXT[],
  requirements TEXT[],
  booking_url TEXT,

  -- PDF download-specific fields
  pdf_path TEXT, -- Path in Supabase storage
  file_size TEXT,
  page_count INTEGER,
  file_format TEXT,
  preview_url TEXT,
  download_limit INTEGER DEFAULT 5,

  -- Inventory and status
  stock_quantity INTEGER,
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_service_fields CHECK (
    product_type != 'service' OR service_type IS NOT NULL
  ),
  CONSTRAINT valid_pdf_fields CHECK (
    product_type != 'pdf_download' OR pdf_path IS NOT NULL
  )
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
-- Extends Supabase auth.users with customer info

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  company TEXT,
  phone TEXT,

  -- Billing address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,

  -- Customer metadata
  customer_type TEXT DEFAULT 'individual' CHECK (customer_type IN ('individual', 'business')),
  total_purchases DECIMAL(10, 2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,

  -- Marketing
  newsletter_subscribed BOOLEAN DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- ============================================
-- PURCHASES TABLE
-- ============================================
-- Tracks all product purchases

CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,

  -- Purchase details
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Payment information
  payment_method TEXT, -- 'stripe', 'paypal', etc.
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  transaction_id TEXT UNIQUE,
  payment_intent_id TEXT,

  -- Order information
  order_number TEXT UNIQUE,
  invoice_url TEXT,
  receipt_url TEXT,

  -- Service-specific
  service_scheduled_date TIMESTAMP WITH TIME ZONE,
  service_completed_date TIMESTAMP WITH TIME ZONE,
  service_status TEXT CHECK (service_status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),

  -- Download tracking (for PDF products)
  download_count INTEGER DEFAULT 0,
  download_expires_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  notes TEXT,
  metadata JSONB,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  purchased_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_purchases_customer ON purchases(customer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_product ON purchases(product_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_purchases_transaction ON purchases(transaction_id);
CREATE INDEX IF NOT EXISTS idx_purchases_order ON purchases(order_number);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(purchased_at DESC);

-- ============================================
-- DOWNLOADS TABLE
-- ============================================
-- Tracks individual PDF download events

CREATE TABLE IF NOT EXISTS downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  purchase_id UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,

  -- Download details
  file_path TEXT NOT NULL,
  file_size_bytes BIGINT,
  download_url TEXT,
  url_expires_at TIMESTAMP WITH TIME ZONE,

  -- Request metadata
  ip_address INET,
  user_agent TEXT,
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  browser TEXT,
  os TEXT,
  country TEXT,

  -- Status
  download_status TEXT DEFAULT 'initiated' CHECK (download_status IN ('initiated', 'completed', 'failed', 'expired')),
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_downloads_customer ON downloads(customer_id);
CREATE INDEX IF NOT EXISTS idx_downloads_purchase ON downloads(purchase_id);
CREATE INDEX IF NOT EXISTS idx_downloads_product ON downloads(product_id);
CREATE INDEX IF NOT EXISTS idx_downloads_date ON downloads(created_at DESC);

-- ============================================
-- NEWSLETTER SUBSCRIPTIONS TABLE
-- ============================================
-- Tracks newsletter signups

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),

  -- Metadata
  source TEXT, -- 'website', 'checkout', etc.
  ip_address INET,
  user_agent TEXT,

  -- Timestamps
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscriptions(status);

-- ============================================
-- PRODUCT REVIEWS TABLE
-- ============================================
-- Customer reviews and ratings

CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,

  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review_text TEXT,

  -- Verification
  verified_purchase BOOLEAN DEFAULT false,

  -- Moderation
  is_published BOOLEAN DEFAULT false,
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
  moderated_by UUID REFERENCES auth.users(id),
  moderated_at TIMESTAMP WITH TIME ZONE,

  -- Helpful votes
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints: one review per customer per product
  CONSTRAINT unique_customer_product_review UNIQUE(product_id, customer_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer ON product_reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_published ON product_reviews(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON product_reviews(rating);

-- ============================================
-- ANALYTICS TABLE
-- ============================================
-- Track events for analytics

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Event details
  event_type TEXT NOT NULL, -- 'page_view', 'product_view', 'add_to_cart', 'purchase', etc.
  event_data JSONB,

  -- User info (can be anonymous)
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  session_id TEXT,

  -- Request metadata
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  page_url TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_customer ON analytics_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON product_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_order_number TEXT;
  order_exists BOOLEAN;
BEGIN
  LOOP
    new_order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');

    SELECT EXISTS(SELECT 1 FROM purchases WHERE order_number = new_order_number) INTO order_exists;

    EXIT WHEN NOT order_exists;
  END LOOP;

  RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Function to check if customer has purchased product
CREATE OR REPLACE FUNCTION customer_has_purchased(
  p_customer_id UUID,
  p_product_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1
    FROM purchases
    WHERE customer_id = p_customer_id
      AND product_id = p_product_id
      AND payment_status = 'completed'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get remaining downloads for a purchase
CREATE OR REPLACE FUNCTION get_remaining_downloads(p_purchase_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_limit INTEGER;
  v_count INTEGER;
BEGIN
  SELECT p.download_limit, pu.download_count
  INTO v_limit, v_count
  FROM purchases pu
  JOIN products p ON pu.product_id = p.id
  WHERE pu.id = p_purchase_id;

  IF v_limit IS NULL THEN
    RETURN -1; -- Unlimited
  END IF;

  RETURN GREATEST(0, v_limit - COALESCE(v_count, 0));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(p_purchase_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE purchases
  SET download_count = download_count + 1
  WHERE id = p_purchase_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update customer stats after purchase
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
    UPDATE customers
    SET
      total_purchases = total_purchases + NEW.total_amount,
      total_orders = total_orders + 1
    WHERE id = NEW.customer_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_stats_trigger AFTER INSERT OR UPDATE ON purchases
  FOR EACH ROW EXECUTE FUNCTION update_customer_stats();

-- ============================================
-- VIEWS
-- ============================================

-- View for active products with all details
CREATE OR REPLACE VIEW active_products AS
SELECT *
FROM products
WHERE is_active = true
ORDER BY featured DESC, created_at DESC;

-- View for customer purchase history
CREATE OR REPLACE VIEW customer_purchase_history AS
SELECT
  p.id,
  p.customer_id,
  c.email,
  c.full_name,
  p.product_id,
  pr.name AS product_name,
  pr.product_type,
  p.total_amount,
  p.payment_status,
  p.order_number,
  p.purchased_at,
  p.download_count,
  pr.download_limit
FROM purchases p
JOIN customers c ON p.customer_id = c.id
JOIN products pr ON p.product_id = pr.id
ORDER BY p.purchased_at DESC;

-- View for product statistics
CREATE OR REPLACE VIEW product_statistics AS
SELECT
  p.id,
  p.name,
  p.product_type,
  COUNT(DISTINCT pu.id) AS total_sales,
  SUM(pu.total_amount) AS total_revenue,
  AVG(r.rating) AS average_rating,
  COUNT(DISTINCT r.id) AS review_count
FROM products p
LEFT JOIN purchases pu ON p.id = pu.product_id AND pu.payment_status = 'completed'
LEFT JOIN product_reviews r ON p.id = r.product_id AND r.is_published = true
GROUP BY p.id, p.name, p.product_type;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE products IS 'All products including services and digital downloads';
COMMENT ON TABLE customers IS 'Customer profiles extending Supabase auth.users';
COMMENT ON TABLE purchases IS 'Product purchases with payment tracking';
COMMENT ON TABLE downloads IS 'Individual PDF download tracking';
COMMENT ON TABLE newsletter_subscriptions IS 'Newsletter email subscriptions';
COMMENT ON TABLE product_reviews IS 'Customer product reviews and ratings';
COMMENT ON TABLE analytics_events IS 'Analytics event tracking';

-- ============================================
-- COMPLETED
-- ============================================

-- Schema creation complete!
-- Next step: Add Row Level Security (RLS) policies
-- See: rls-policies.sql
