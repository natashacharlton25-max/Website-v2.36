/**
 * Contact Form API Endpoint
 * Handles form submissions, sends notification to owner, and auto-reply to sender
 */

import type { APIRoute } from 'astro';

// Brand colors (matches website theme)
const BRAND_COLORS = {
  background: '#f9f8f6',
  text: '#474747',
  textLight: '#6b7280',
  primary: '#8fa68a',
  primaryDark: '#7a9175',
  accent: '#c4907c',
  white: '#ffffff',
  border: '#e8e6e3',
  highlight: '#f0ebe6'
};

// Email template wrapper with beautiful brand styling
function emailTemplate(content: string, footerNote?: string): string {
  const defaultFooterNote = 'This is an automated message from our contact form.';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>Walking with a Smile</title>
  <style>
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    body {
      font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.7;
      color: ${BRAND_COLORS.text};
      margin: 0;
      padding: 0;
      background-color: ${BRAND_COLORS.background};
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: ${BRAND_COLORS.background};
      padding: 40px 20px;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background: ${BRAND_COLORS.white};
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }
    .header {
      background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%);
      padding: 36px 40px;
      text-align: center;
    }
    .logo-text {
      font-size: 26px;
      font-weight: 700;
      color: ${BRAND_COLORS.white};
      letter-spacing: 0.5px;
      margin: 0;
    }
    .tagline {
      font-size: 13px;
      color: rgba(255,255,255,0.85);
      margin: 8px 0 0 0;
    }
    .content {
      padding: 40px;
    }
    h1 {
      color: ${BRAND_COLORS.text};
      font-size: 22px;
      font-weight: 600;
      margin: 0 0 20px 0;
      line-height: 1.3;
    }
    h2 {
      color: ${BRAND_COLORS.text};
      font-size: 16px;
      font-weight: 600;
      margin: 24px 0 12px 0;
    }
    p {
      color: ${BRAND_COLORS.text};
      font-size: 15px;
      margin: 0 0 16px 0;
      line-height: 1.7;
    }
    .info-box {
      background: ${BRAND_COLORS.highlight};
      border-radius: 12px;
      padding: 20px 24px;
      margin: 24px 0;
    }
    .info-row {
      margin-bottom: 12px;
    }
    .info-row:last-child {
      margin-bottom: 0;
    }
    .info-label {
      font-weight: 600;
      color: ${BRAND_COLORS.text};
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: block;
      margin-bottom: 2px;
    }
    .info-value {
      color: ${BRAND_COLORS.textLight};
      font-size: 15px;
    }
    .message-box {
      background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);
      border-left: 4px solid ${BRAND_COLORS.primary};
      border-radius: 0 12px 12px 0;
      padding: 20px 24px;
      margin: 24px 0;
    }
    .message-box p {
      margin: 0;
      white-space: pre-wrap;
    }
    .reply-hint {
      background: ${BRAND_COLORS.highlight};
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 13px;
      color: ${BRAND_COLORS.textLight};
      margin-top: 24px;
    }
    .divider {
      height: 1px;
      background: ${BRAND_COLORS.border};
      margin: 32px 0;
    }
    .footer {
      background: ${BRAND_COLORS.highlight};
      padding: 28px 40px;
      text-align: center;
    }
    .footer-brand {
      font-size: 14px;
      font-weight: 600;
      color: ${BRAND_COLORS.text};
      margin: 0 0 6px 0;
    }
    .footer-tagline {
      font-size: 13px;
      color: ${BRAND_COLORS.textLight};
      margin: 0 0 16px 0;
    }
    .footer-links {
      margin: 0 0 16px 0;
    }
    .footer-links a {
      color: ${BRAND_COLORS.primary};
      text-decoration: none;
      font-size: 13px;
      margin: 0 12px;
    }
    .footer-note {
      font-size: 12px;
      color: ${BRAND_COLORS.textLight};
      margin: 0;
      opacity: 0.8;
    }
    @media only screen and (max-width: 600px) {
      .wrapper { padding: 20px 16px; }
      .header { padding: 28px 24px; }
      .content { padding: 28px 24px; }
      .footer { padding: 24px; }
      h1 { font-size: 20px; }
      .logo-text { font-size: 22px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <p class="logo-text">Walking with a Smile</p>
        <p class="tagline">Supporting your journey, one step at a time</p>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p class="footer-brand">Walking with a Smile</p>
        <p class="footer-tagline">Supporting trauma recovery and healing</p>
        <p class="footer-links">
          <a href="https://walkingwithasmile.com">Website</a>
          <a href="https://walkingwithasmile.com/assets">Resources</a>
        </p>
        <p class="footer-note">${footerNote || defaultFooterNote}</p>
      </div>
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
          <span class="info-label">From</span>
          <span class="info-value">${name}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-value">${email}</span>
        </div>
        ${phone ? `
        <div class="info-row">
          <span class="info-label">Phone</span>
          <span class="info-value">${phone}</span>
        </div>
        ` : ''}
        <div class="info-row">
          <span class="info-label">Topic</span>
          <span class="info-value">${subject}</span>
        </div>
      </div>
      <h2>Their Message</h2>
      <div class="message-box">
        <p>${message.replace(/\n/g, '<br>')}</p>
      </div>
      <div class="reply-hint">
        <strong>Tip:</strong> Reply directly to this email to respond to ${name}.
      </div>
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
        subject: `New message: ${subject}`,
        html: emailTemplate(notificationContent, 'New contact form submission from your website.'),
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
      <h1>Thank you for reaching out</h1>
      <p>Hi ${name},</p>
      <p>We've received your message and wanted to let you know that it's in safe hands. We typically respond within 1-2 working days.</p>
      <div class="message-box">
        <p style="font-size: 13px; color: ${BRAND_COLORS.textLight}; margin-bottom: 8px;"><strong>Your message:</strong></p>
        <p style="font-style: italic;">"${message.length > 200 ? message.substring(0, 200) + '...' : message}"</p>
      </div>
      <div class="divider"></div>
      <p>In the meantime, feel free to explore our <a href="https://walkingwithasmile.com/assets" style="color: ${BRAND_COLORS.primary};">resources</a> and <a href="https://walkingwithasmile.com/insights" style="color: ${BRAND_COLORS.primary};">insights</a> to see how we can support your journey.</p>
      <p style="color: ${BRAND_COLORS.textLight};">With warmth,<br><strong>The Walking with a Smile Team</strong></p>
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
        html: emailTemplate(autoReplyContent, 'You received this email because you contacted us through our website.')
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
