/**
 * Supabase Client Configuration
 *
 * Provides a configured Supabase client for database and storage operations.
 */

import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables are not set. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Bucket names
export const BUCKETS = {
  PDFS: import.meta.env.PUBLIC_SUPABASE_PDF_BUCKET || 'pdfs',
  IMAGES: import.meta.env.PUBLIC_SUPABASE_IMAGES_BUCKET || 'images',
} as const;

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Get the public URL for a file in storage
 */
export function getPublicUrl(bucket: string, path: string): string {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase is not configured');
    return '';
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Get a signed URL for private file access (expires after specified time)
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase is not configured');
    return null;
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error('Error creating signed URL:', error);
    return null;
  }

  return data.signedUrl;
}

// ============================================
// BOOKING SYSTEM
// ============================================

// Types for booking system
export interface Booking {
  id?: string;
  created_at?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  booking_date: string;
  booking_time: string;
  service_type?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

/**
 * Create a new booking
 */
export async function createBooking(booking: Omit<Booking, 'id' | 'created_at'>) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert([booking])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all bookings for a specific date
 */
export async function getBookingsForDate(date: string): Promise<Booking[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_date', date)
    .neq('status', 'cancelled');

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
  return data || [];
}

/**
 * Get available time slots for a date
 */
export async function getAvailableSlots(date: string, allSlots: string[]): Promise<TimeSlot[]> {
  const bookings = await getBookingsForDate(date);
  const bookedTimes = bookings.map(b => b.booking_time);

  return allSlots.map(time => ({
    time,
    available: !bookedTimes.includes(time)
  }));
}

/**
 * Cancel a booking
 */
export async function cancelBooking(id: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', id);

  if (error) throw error;
}

/**
 * Confirm a booking
 */
export async function confirmBooking(id: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', id);

  if (error) throw error;
}
