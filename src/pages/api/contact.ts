/**
 * Contact Form API Endpoint
 * Handles form submissions and sends emails via EmailIt API
 */

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get form data
    const data = await request.json();
    const { name, email, phone, subject, message } = data;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields'
        }),
        { status: 400 }
      );
    }

    // Get EmailIt configuration from environment variables
    const EMAILIT_API_KEY = import.meta.env.EMAILIT_API_KEY;
    const EMAILIT_API_URL = import.meta.env.EMAILIT_API_URL || 'https://api.emailit.com/v1/emails';
    const RECIPIENT_EMAIL = import.meta.env.RECIPIENT_EMAIL;

    if (!EMAILIT_API_KEY || !RECIPIENT_EMAIL) {
      console.error('Missing EmailIt configuration in environment variables');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email service not configured'
        }),
        { status: 500 }
      );
    }

    // Prepare email content
    const emailSubject = `Contact Form: ${subject}`;
    const emailBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Subject:</strong> ${subject}</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    // Send email via EmailIt API
    const response = await fetch(EMAILIT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EMAILIT_API_KEY}`
      },
      body: JSON.stringify({
        to: RECIPIENT_EMAIL,
        from: email,
        subject: emailSubject,
        html: emailBody,
        replyTo: email
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('EmailIt API error:', errorText);
      throw new Error('Failed to send email via EmailIt');
    }

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully'
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to send email. Please try again later.'
      }),
      { status: 500 }
    );
  }
};
