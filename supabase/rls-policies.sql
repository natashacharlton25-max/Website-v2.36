-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Secure database access with granular permissions
-- Run this AFTER schema.sql

-- ============================================
-- ENABLE RLS
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PRODUCTS POLICIES
-- ============================================

-- Anyone can view active products (public access)
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Authenticated users can view all products
CREATE POLICY "Authenticated users can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can insert/update/delete products (admin only)
CREATE POLICY "Service role can insert products"
  ON products FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update products"
  ON products FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete products"
  ON products FOR DELETE
  TO service_role
  USING (true);

-- ============================================
-- CUSTOMERS POLICIES
-- ============================================

-- Users can view their own customer record
CREATE POLICY "Users can view own customer record"
  ON customers FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can insert their own customer record
CREATE POLICY "Users can insert own customer record"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can update their own customer record
CREATE POLICY "Users can update own customer record"
  ON customers FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role has full access
CREATE POLICY "Service role has full access to customers"
  ON customers FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- PURCHASES POLICIES
-- ============================================

-- Users can view their own purchases
CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = customer_id);

-- Users can insert their own purchases (during checkout)
CREATE POLICY "Users can insert own purchases"
  ON purchases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

-- Users can update their own pending purchases
CREATE POLICY "Users can update own pending purchases"
  ON purchases FOR UPDATE
  TO authenticated
  USING (auth.uid() = customer_id AND payment_status = 'pending')
  WITH CHECK (auth.uid() = customer_id);

-- Service role has full access (for webhooks, admin)
CREATE POLICY "Service role has full access to purchases"
  ON purchases FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- DOWNLOADS POLICIES
-- ============================================

-- Users can view their own downloads
CREATE POLICY "Users can view own downloads"
  ON downloads FOR SELECT
  TO authenticated
  USING (auth.uid() = customer_id);

-- Users can insert their own downloads
CREATE POLICY "Users can insert own downloads"
  ON downloads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

-- Service role has full access
CREATE POLICY "Service role has full access to downloads"
  ON downloads FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- NEWSLETTER POLICIES
-- ============================================

-- Anyone can subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscriptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
  ON newsletter_subscriptions FOR SELECT
  TO authenticated
  USING (email = auth.email());

-- Users can update their own subscription (unsubscribe)
CREATE POLICY "Users can update own subscription"
  ON newsletter_subscriptions FOR UPDATE
  TO authenticated
  USING (email = auth.email())
  WITH CHECK (email = auth.email());

-- Service role has full access
CREATE POLICY "Service role has full access to newsletter"
  ON newsletter_subscriptions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- PRODUCT REVIEWS POLICIES
-- ============================================

-- Anyone can view published reviews
CREATE POLICY "Anyone can view published reviews"
  ON product_reviews FOR SELECT
  USING (is_published = true);

-- Authenticated users can view their own reviews (even if not published)
CREATE POLICY "Users can view own reviews"
  ON product_reviews FOR SELECT
  TO authenticated
  USING (auth.uid() = customer_id);

-- Users can insert reviews for products they purchased
CREATE POLICY "Users can insert reviews for purchased products"
  ON product_reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = customer_id
    AND customer_has_purchased(auth.uid(), product_id)
  );

-- Users can update their own reviews (if not yet published)
CREATE POLICY "Users can update own unpublished reviews"
  ON product_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = customer_id AND is_published = false)
  WITH CHECK (auth.uid() = customer_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON product_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = customer_id);

-- Service role has full access (for moderation)
CREATE POLICY "Service role has full access to reviews"
  ON product_reviews FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- ANALYTICS POLICIES
-- ============================================

-- Anyone can insert analytics events
CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Users can view their own events
CREATE POLICY "Users can view own analytics events"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (auth.uid() = customer_id);

-- Service role has full access (for reports)
CREATE POLICY "Service role has full access to analytics"
  ON analytics_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- STORAGE BUCKET POLICIES
-- ============================================

-- PDF bucket policies (for private PDF downloads)
-- Run these in the Supabase Storage > Policies section

-- Allow authenticated users to download PDFs they purchased
-- CREATE POLICY "Users can download purchased PDFs"
--   ON storage.objects FOR SELECT
--   TO authenticated
--   USING (
--     bucket_id = 'pdfs'
--     AND (storage.foldername(name))[1] = 'products'
--     AND customer_has_purchased(auth.uid(), (storage.filename(name))::UUID)
--   );

-- Service role can upload/delete PDFs (admin only)
-- CREATE POLICY "Service role can manage PDFs"
--   ON storage.objects FOR ALL
--   TO service_role
--   USING (bucket_id = 'pdfs')
--   WITH CHECK (bucket_id = 'pdfs');

-- ============================================
-- HELPER FUNCTIONS FOR POLICIES
-- ============================================

-- Check if user can download a specific purchase
CREATE OR REPLACE FUNCTION can_download_purchase(
  p_purchase_id UUID,
  p_customer_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1
    FROM purchases
    WHERE id = p_purchase_id
      AND customer_id = p_customer_id
      AND payment_status = 'completed'
      AND (
        download_expires_at IS NULL
        OR download_expires_at > NOW()
      )
      AND (
        download_count < (
          SELECT download_limit
          FROM products
          WHERE id = purchases.product_id
        )
        OR (
          SELECT download_limit
          FROM products
          WHERE id = purchases.product_id
        ) IS NULL
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is an admin (you can customize this)
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Option 1: Check a custom claim in JWT
  -- RETURN (auth.jwt() ->> 'role') = 'admin';

  -- Option 2: Check email domain
  -- RETURN EXISTS(
  --   SELECT 1 FROM auth.users
  --   WHERE id = p_user_id
  --   AND email LIKE '%@yourdomain.com'
  -- );

  -- Option 3: Check a specific user ID
  RETURN p_user_id IN (
    'your-admin-user-uuid-here'::UUID
    -- Add more admin UUIDs as needed
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TESTING POLICIES
-- ============================================

-- Test queries to verify policies work correctly:

-- As anonymous user:
-- SELECT * FROM products; -- Should see only active products

-- As authenticated user:
-- SELECT * FROM products; -- Should see all products
-- SELECT * FROM customers WHERE id = auth.uid(); -- Should see own record
-- SELECT * FROM purchases WHERE customer_id = auth.uid(); -- Should see own purchases

-- As service role:
-- (All operations should work)

-- ============================================
-- SECURITY NOTES
-- ============================================

/*
IMPORTANT SECURITY CONSIDERATIONS:

1. SERVICE ROLE KEY:
   - Never expose service_role key to clients
   - Only use in server-side code (API routes, webhooks)
   - Use anon key for client-side operations

2. AUTHENTICATION:
   - Always verify user authentication before sensitive operations
   - Use RLS policies to enforce access control
   - Validate purchase ownership before generating download links

3. PAYMENT WEBHOOKS:
   - Verify webhook signatures (Stripe, PayPal, etc.)
   - Use service role for webhook operations
   - Never trust client-side payment confirmations

4. DOWNLOAD LIMITS:
   - Enforce download limits in application logic
   - Track download attempts
   - Set expiration times for download URLs

5. REVIEWS MODERATION:
   - Require moderation before publishing reviews
   - Implement spam detection
   - Allow users to report inappropriate reviews

6. ANALYTICS:
   - Anonymize or hash IP addresses
   - Comply with GDPR/privacy regulations
   - Provide user data export/deletion capabilities
*/

-- ============================================
-- COMPLETED
-- ============================================

-- RLS policies configured!
-- Your database is now secure with proper access control.
