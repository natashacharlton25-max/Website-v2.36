/**
 * API Route: Generate Download Link
 * POST /api/download
 *
 * Generates a signed URL for downloading a purchased PDF
 * Requires authentication and purchase verification
 */

import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { getSignedUrl } from '../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Get request body
    const body = await request.json();
    const { purchaseId } = body;

    if (!purchaseId) {
      return new Response(
        JSON.stringify({ error: 'Purchase ID required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get auth token from cookies or header
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

    // Get purchase details with product info
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select(`
        *,
        product:products(
          id,
          name,
          pdf_path,
          download_limit
        )
      `)
      .eq('id', purchaseId)
      .eq('customer_id', user.id)
      .eq('payment_status', 'completed')
      .single();

    if (purchaseError || !purchase) {
      return new Response(
        JSON.stringify({ error: 'Purchase not found or not authorized' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if product is downloadable
    if (!purchase.product.pdf_path) {
      return new Response(
        JSON.stringify({ error: 'This product is not downloadable' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check download limit
    const downloadLimit = purchase.product.download_limit;
    if (downloadLimit !== null && purchase.download_count >= downloadLimit) {
      return new Response(
        JSON.stringify({
          error: 'Download limit reached',
          limit: downloadLimit,
          count: purchase.download_count
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check expiration
    if (purchase.download_expires_at && new Date(purchase.download_expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'Download link has expired' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate signed URL (1 hour expiry)
    const signedUrl = await getSignedUrl('pdfs', purchase.product.pdf_path, 3600);

    if (!signedUrl) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate download link' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Track download event
    await supabase.from('downloads').insert({
      customer_id: user.id,
      product_id: purchase.product.id,
      purchase_id: purchaseId,
      file_path: purchase.product.pdf_path,
      download_url: signedUrl,
      url_expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
      download_status: 'initiated',
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      user_agent: request.headers.get('user-agent')
    });

    // Increment download count
    await supabase.rpc('increment_download_count', { p_purchase_id: purchaseId });

    return new Response(
      JSON.stringify({
        success: true,
        url: signedUrl,
        expiresIn: 3600,
        downloadCount: purchase.download_count + 1,
        downloadLimit: downloadLimit,
        productName: purchase.product.name
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Download API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
