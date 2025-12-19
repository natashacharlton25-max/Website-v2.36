-- =====================================================
-- BOOKING SYSTEM SCHEMA
-- =====================================================
-- Run this SQL in your Supabase project's SQL Editor
-- Dashboard > SQL Editor > New Query
-- =====================================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Customer Info
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),

    -- Booking Details
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    service_type VARCHAR(100),
    duration_minutes INTEGER DEFAULT 60,
    notes TEXT,

    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),

    -- Payment (optional)
    payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    payment_amount DECIMAL(10, 2),
    stripe_payment_id VARCHAR(255),

    -- Google Calendar Integration
    google_event_id VARCHAR(255),
    google_meet_link VARCHAR(500),

    -- Indexes for common queries
    CONSTRAINT unique_booking UNIQUE (booking_date, booking_time)
);

-- Index for date queries (finding bookings by date)
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);

-- Index for customer email (finding customer's bookings)
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email);

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- =====================================================
-- SERVICES TABLE (Optional - for dynamic services)
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    price DECIMAL(10, 2) NOT NULL,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0
);

-- Insert default services
INSERT INTO services (name, description, duration_minutes, price, sort_order)
VALUES
    ('Consultation', 'Initial consultation session', 30, 50.00, 1),
    ('Full Session', 'Standard full session', 60, 100.00, 2),
    ('Premium Package', 'Extended premium session', 90, 150.00, 3)
ON CONFLICT DO NOTHING;

-- =====================================================
-- AVAILABILITY TABLE (Optional - for custom schedules)
-- =====================================================
CREATE TABLE IF NOT EXISTS availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true
);

-- Insert default availability (Mon-Fri, 9am-5pm)
INSERT INTO availability (day_of_week, start_time, end_time, is_available)
VALUES
    (1, '09:00', '17:00', true), -- Monday
    (2, '09:00', '17:00', true), -- Tuesday
    (3, '09:00', '17:00', true), -- Wednesday
    (4, '09:00', '17:00', true), -- Thursday
    (5, '09:00', '17:00', true)  -- Friday
ON CONFLICT DO NOTHING;

-- =====================================================
-- BLOCKED DATES TABLE (Optional - for holidays/time off)
-- =====================================================
CREATE TABLE IF NOT EXISTS blocked_dates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    blocked_date DATE NOT NULL UNIQUE,
    reason VARCHAR(255)
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Public can read services
CREATE POLICY "Services are viewable by everyone"
    ON services FOR SELECT
    USING (active = true);

-- Public can read availability
CREATE POLICY "Availability is viewable by everyone"
    ON availability FOR SELECT
    USING (true);

-- Public can read blocked dates
CREATE POLICY "Blocked dates are viewable by everyone"
    ON blocked_dates FOR SELECT
    USING (true);

-- Public can create bookings
CREATE POLICY "Anyone can create bookings"
    ON bookings FOR INSERT
    WITH CHECK (true);

-- Public can read bookings (for checking availability)
-- In production, you might want to restrict this
CREATE POLICY "Bookings are viewable for availability check"
    ON bookings FOR SELECT
    USING (true);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- VIEWS (Optional - useful queries)
-- =====================================================

-- Upcoming bookings view
CREATE OR REPLACE VIEW upcoming_bookings AS
SELECT
    b.*,
    s.name as service_name,
    s.price as service_price
FROM bookings b
LEFT JOIN services s ON b.service_type = s.id::text
WHERE b.booking_date >= CURRENT_DATE
  AND b.status NOT IN ('cancelled')
ORDER BY b.booking_date, b.booking_time;

-- Today's bookings view
CREATE OR REPLACE VIEW todays_bookings AS
SELECT * FROM bookings
WHERE booking_date = CURRENT_DATE
  AND status NOT IN ('cancelled')
ORDER BY booking_time;

-- =====================================================
-- SAMPLE QUERIES
-- =====================================================

-- Get available slots for a date:
-- SELECT booking_time FROM bookings
-- WHERE booking_date = '2024-01-15'
--   AND status != 'cancelled';

-- Get bookings for a customer:
-- SELECT * FROM bookings
-- WHERE customer_email = 'customer@example.com'
-- ORDER BY booking_date DESC, booking_time DESC;

-- Get today's schedule:
-- SELECT * FROM todays_bookings;

-- =====================================================
-- NOTES
-- =====================================================
-- 1. Make sure to enable Row Level Security in Supabase dashboard
-- 2. Adjust RLS policies based on your authentication needs
-- 3. For production, consider adding more restrictive policies
-- 4. Remember to set up email notifications via Edge Functions
