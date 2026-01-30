/**
 * Emailit Integration
 * Sends transactional emails for verification and downloads
 */

interface EmailitResponse {
  success: boolean;
  message?: string;
  id?: string;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Get Emailit configuration from environment
function getConfig() {
  const apiKey = import.meta.env.EMAILIT_API_KEY;
  const apiUrl = import.meta.env.EMAILIT_API_URL || 'https://api.emailit.com/v1/emails';

  if (!apiKey) {
    throw new Error('Missing EMAILIT_API_KEY environment variable');
  }

  return { apiKey, apiUrl };
}

// Send email via Emailit API
async function sendEmail(options: SendEmailOptions): Promise<EmailitResponse> {
  const { apiKey, apiUrl } = getConfig();

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Walking with a Smile <hello@nslc.pro>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || stripHtml(options.html)
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Emailit API error:', error);
      return { success: false, message: error };
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, message: String(error) };
  }
}

// Strip HTML for plain text version
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Email template wrapper
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
    .button {
      display: inline-block;
      background: #6366f1;
      color: white !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
    .button:hover {
      background: #4f46e5;
    }
    .download-list {
      background: #f9fafb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .download-item {
      display: flex;
      align-items: center;
      padding: 12px;
      background: white;
      border-radius: 6px;
      margin-bottom: 8px;
      border: 1px solid #e5e7eb;
    }
    .download-item:last-child {
      margin-bottom: 0;
    }
    .download-name {
      flex: 1;
      font-weight: 500;
      color: #374151;
    }
    .download-link {
      color: #6366f1;
      text-decoration: none;
      font-weight: 500;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #9ca3af;
    }
    .note {
      background: #fef3c7;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      padding: 16px;
      font-size: 14px;
      color: #92400e;
      margin: 20px 0;
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
      <p>You received this email because you requested downloads from our website.</p>
    </div>
  </div>
</body>
</html>`;
}

// Send verification email
export async function sendVerificationEmail(
  email: string,
  firstName: string,
  verificationToken: string,
  siteUrl: string
): Promise<EmailitResponse> {
  const verifyUrl = `${siteUrl}/verify?token=${verificationToken}`;

  const content = `
    <h1>Please verify your email</h1>
    <p>Hi ${firstName},</p>
    <p>Thanks for requesting downloads from Walking with a Smile! Before we can send you the files, we need to verify your email address.</p>
    <p style="text-align: center;">
      <a href="${verifyUrl}" class="button">Verify My Email</a>
    </p>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; font-size: 14px; color: #6b7280;">${verifyUrl}</p>
    <div class="note">
      <strong>This link expires in 24 hours.</strong> If you didn't request this, you can safely ignore this email.
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify your email to get your downloads',
    html: emailTemplate(content)
  });
}

// Send download links email
export async function sendDownloadEmail(
  email: string,
  firstName: string,
  downloads: Array<{ name: string; url: string }>,
  tier: string,
  remaining: number
): Promise<EmailitResponse> {
  const downloadItems = downloads.map(d => `
    <div class="download-item">
      <span class="download-name">${d.name}</span>
      <a href="${d.url}" class="download-link">Download</a>
    </div>
  `).join('');

  const remainingText = remaining === Infinity
    ? 'You have unlimited downloads as a VIP member!'
    : `You have ${remaining} download${remaining !== 1 ? 's' : ''} remaining this month.`;

  const content = `
    <h1>Your downloads are ready!</h1>
    <p>Hi ${firstName},</p>
    <p>Great news! Your email has been verified and your downloads are ready. Click the links below to get your files:</p>
    <div class="download-list">
      ${downloadItems}
    </div>
    <div class="note">
      <strong>Note:</strong> These download links expire in 7 days. ${remainingText}
    </div>
    <p>Thank you for choosing Walking with a Smile! We hope these resources help make a difference.</p>
  `;

  return sendEmail({
    to: email,
    subject: `Your ${downloads.length} download${downloads.length !== 1 ? 's are' : ' is'} ready!`,
    html: emailTemplate(content)
  });
}

// Send "already verified" email with new download links
export async function sendExistingUserDownloadEmail(
  email: string,
  firstName: string,
  downloads: Array<{ name: string; url: string }>,
  tier: string,
  remaining: number
): Promise<EmailitResponse> {
  const downloadItems = downloads.map(d => `
    <div class="download-item">
      <span class="download-name">${d.name}</span>
      <a href="${d.url}" class="download-link">Download</a>
    </div>
  `).join('');

  const remainingText = remaining === Infinity
    ? 'You have unlimited downloads as a VIP member!'
    : `You have ${remaining} download${remaining !== 1 ? 's' : ''} remaining this month.`;

  const content = `
    <h1>Your downloads are ready!</h1>
    <p>Hi ${firstName},</p>
    <p>Welcome back! Since you're already verified, here are your download links:</p>
    <div class="download-list">
      ${downloadItems}
    </div>
    <div class="note">
      <strong>Note:</strong> These download links expire in 7 days. ${remainingText}
    </div>
    <p>Thank you for being part of the Walking with a Smile community!</p>
  `;

  return sendEmail({
    to: email,
    subject: `Your ${downloads.length} download${downloads.length !== 1 ? 's are' : ' is'} ready!`,
    html: emailTemplate(content)
  });
}

// Send download limit reached email
export async function sendLimitReachedEmail(
  email: string,
  firstName: string,
  tier: string,
  limit: number,
  resetDate: Date
): Promise<EmailitResponse> {
  const upgradeText = tier === 'free'
    ? '<p>Want more downloads? Subscribe to our newsletter to get 10 downloads per month!</p>'
    : tier === 'newsletter'
    ? '<p>Want more downloads? Upgrade to a subscription for 20 downloads per month, or become a VIP for unlimited access!</p>'
    : '';

  const content = `
    <h1>Download limit reached</h1>
    <p>Hi ${firstName},</p>
    <p>You've reached your monthly download limit of ${limit} downloads. Your limit will reset on ${resetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.</p>
    ${upgradeText}
    <p>If you have any questions, feel free to reach out to us.</p>
  `;

  return sendEmail({
    to: email,
    subject: 'Monthly download limit reached',
    html: emailTemplate(content)
  });
}
