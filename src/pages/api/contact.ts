/**
 * Contact Form API Endpoint
 * Handles form submissions, sends notification to owner, and auto-reply to sender
 */

import type { APIRoute } from 'astro';

// Email template wrapper (matches the download email style)
function emailTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #6366f1;
    }
    h1 {
      color: #1f2937;
      font-size: 24px;
      margin-bottom: 20px;
    }
    p {
      color: #4b5563;
      margin-bottom: 16px;
    }
    .info-box {
      background: #f9fafb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-row {
      margin-bottom: 12px;
    }
    .info-label {
      font-weight: 600;
      color: #374151;
    }
    .info-value {
      color: #6b7280;
    }
    .message-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Walking with a Smile</div>
    </div>
    ${content}
    <div class="footer">
      <p>Walking with a Smile &bull; Helping children learn and grow</p>
    </div>
  </div>
</body>
</html>`;
}

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

    // Get EmailIt configuration from environment variables
    const EMAILIT_API_KEY = import.meta.env.EMAILIT_API_KEY;
    const EMAILIT_API_URL = import.meta.env.EMAILIT_API_URL || 'https://api.emailit.com/v1/emails';
    // Default recipient - change this to your email
    const RECIPIENT_EMAIL = import.meta.env.RECIPIENT_EMAIL || 'hello@nslc.pro';
    const SENDER_EMAIL = 'Walking with a Smile <hello@nslc.pro>';

    if (!EMAILIT_API_KEY) {
      console.error('Missing EMAILIT_API_KEY in environment variables');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email service not configured'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Send notification email to owner
    const notificationContent = `
      <h1>New Contact Form Message</h1>
      <div class="info-box">
        <div class="info-row">
          <span class="info-label">From:</span>
          <span class="info-value">${name}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value">${email}</span>
        </div>
        ${phone ? `
        <div class="info-row">
          <span class="info-label">Phone:</span>
          <span class="info-value">${phone}</span>
        </div>
        ` : ''}
        <div class="info-row">
          <span class="info-label">Subject:</span>
          <span class="info-value">${subject}</span>
        </div>
      </div>
      <h2>Message:</h2>
      <div class="message-box">
        <p>${message.replace(/\n/g, '<br>')}</p>
      </div>
      <p><em>Reply directly to this email to respond to ${name}.</em></p>
    `;

    const notificationResponse = await fetch(EMAILIT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EMAILIT_API_KEY}`
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: RECIPIENT_EMAIL,
        subject: `Contact Form: ${subject}`,
        html: emailTemplate(notificationContent),
        replyTo: email
      })
    });

    if (!notificationResponse.ok) {
      const errorText = await notificationResponse.text();
      console.error('EmailIt API error (notification):', errorText);
      throw new Error('Failed to send notification email');
    }

    // 2. Send auto-reply to the person who submitted the form
    const autoReplyContent = `
      <h1>Thank you for getting in touch!</h1>
      <p>Hi ${name},</p>
      <p>We've received your message and will get back to you as soon as possible, usually within 1-2 business days.</p>
      <div class="info-box">
        <p><strong>Your message:</strong></p>
        <p><em>"${message.length > 200 ? message.substring(0, 200) + '...' : message}"</em></p>
      </div>
      <p>In the meantime, feel free to explore our resources and see how we can help support your journey.</p>
      <p>Warm regards,<br>The Walking with a Smile Team</p>
    `;

    const autoReplyResponse = await fetch(EMAILIT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EMAILIT_API_KEY}`
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: email,
        subject: 'Thank you for contacting Walking with a Smile',
        html: emailTemplate(autoReplyContent)
      })
    });

    if (!autoReplyResponse.ok) {
      // Log but don't fail - notification was sent successfully
      const errorText = await autoReplyResponse.text();
      console.error('EmailIt API error (auto-reply):', errorText);
    }

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Your message has been sent! Check your email for a confirmation.'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to send message. Please try again later.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
