/**
 * Checkout API Endpoint
 * Handles form submission, creates user, sends verification email
 */

import type { APIRoute } from 'astro';
import type { D1Database } from '../../lib/db';
import {
  createOrGetUser,
  createVerificationToken,
  addPendingDownloads,
  canUserDownload,
  createDownloadToken
} from '../../lib/db';
import {
  sendVerificationEmail,
  sendExistingUserDownloadEmail,
  sendLimitReachedEmail
} from '../../lib/emailit';

interface CheckoutRequest {
  firstName: string;
  lastName: string;
  email: string;
  newsletter: boolean;
  downloads: Array<{
    id: string;
    name: string;
    slug?: string;
  }>;
}

// Runtime type for Cloudflare
interface Runtime {
  env: {
    DB: D1Database;
  };
}

export const POST: APIRoute = async ({ request, url, locals }) => {
  try {
    // Get D1 database from Cloudflare runtime
    const runtime = locals.runtime as Runtime;
    const db = runtime?.env?.DB;

    if (!db) {
      console.error('D1 database not available');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Database not configured'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const data: CheckoutRequest = await request.json();
    const { firstName, lastName, email, newsletter, downloads } = data;

    // Validate required fields
    if (!firstName || !email || !downloads?.length) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid email address'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create or get user
    const { user } = await createOrGetUser(db, email, firstName, lastName, newsletter);

    // Get site URL for links
    const siteUrl = url.origin;

    // Check download limits
    const { allowed, remaining, limit } = await canUserDownload(db, user);

    if (!allowed) {
      // User has exceeded their download limit
      const resetDate = new Date();
      resetDate.setMonth(resetDate.getMonth() + 1);
      resetDate.setDate(1);

      await sendLimitReachedEmail(email, firstName, user.tier, limit, resetDate);

      return new Response(
        JSON.stringify({
          success: false,
          error: 'download_limit_reached',
          message: `You've reached your monthly limit of ${limit} downloads. Your limit resets on ${resetDate.toLocaleDateString()}.`,
          limit,
          tier: user.tier
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if downloads requested exceed remaining
    if (downloads.length > remaining && remaining !== Infinity) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'too_many_downloads',
          message: `You can only download ${remaining} more item${remaining !== 1 ? 's' : ''} this month. Please reduce your selection.`,
          remaining,
          limit,
          tier: user.tier
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If user is already verified, send downloads directly
    if (user.email_verified === 1) {
      // Generate download tokens and URLs
      const downloadLinks = await Promise.all(
        downloads.map(async (d) => {
          const token = await createDownloadToken(db, user.id, d.id);
          return {
            name: d.name,
            url: `${siteUrl}/api/download?token=${token}`
          };
        })
      );

      // Send download email
      await sendExistingUserDownloadEmail(
        email,
        firstName,
        downloadLinks,
        user.tier,
        remaining - downloads.length
      );

      return new Response(
        JSON.stringify({
          success: true,
          verified: true,
          message: 'Download links have been sent to your email!'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // User needs verification - store pending downloads
    await addPendingDownloads(db, user.id, downloads);

    // Create verification token and send email
    const verificationToken = await createVerificationToken(db, user.id);
    const emailResult = await sendVerificationEmail(email, firstName, verificationToken, siteUrl);

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.message);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to send verification email. Please try again.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        verified: false,
        message: 'Please check your email to verify and receive your downloads!'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
