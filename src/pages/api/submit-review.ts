/**
 * API Route: Submit Product Review
 * POST /api/submit-review
 *
 * Allows customers to submit reviews for products they've purchased
 */

import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Get request body
    const body = await request.json();
    const { productId, rating, title, reviewText } = body;

    // Validation
    if (!productId || !rating) {
      return new Response(
        JSON.stringify({ error: 'Product ID and rating are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ error: 'Rating must be between 1 and 5' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get auth token
    const token = cookies.get('sb-access-token')?.value ||
                  request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify user session
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has purchased this product
    const { data: hasPurchased } = await supabase.rpc(
      'customer_has_purchased',
      { p_customer_id: user.id, p_product_id: productId }
    );

    if (!hasPurchased) {
      return new Response(
        JSON.stringify({ error: 'You must purchase this product before reviewing it' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the purchase ID for verified purchase badge
    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('customer_id', user.id)
      .eq('product_id', productId)
      .eq('payment_status', 'completed')
      .order('purchased_at', { ascending: false })
      .limit(1)
      .single();

    // Submit review
    const { data: review, error: reviewError } = await supabase
      .from('product_reviews')
      .insert({
        product_id: productId,
        customer_id: user.id,
        purchase_id: purchase?.id,
        rating,
        title,
        review_text: reviewText,
        verified_purchase: !!purchase,
        is_published: false, // Requires moderation
        moderation_status: 'pending'
      })
      .select()
      .single();

    if (reviewError) {
      // Check if it's a duplicate review
      if (reviewError.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'You have already reviewed this product' }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }

      console.error('Review submission error:', reviewError);
      return new Response(
        JSON.stringify({ error: 'Failed to submit review' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        review: {
          id: review.id,
          rating: review.rating,
          title: review.title,
          status: 'pending_moderation',
          message: 'Thank you for your review! It will be published after moderation.'
        }
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Submit review API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
