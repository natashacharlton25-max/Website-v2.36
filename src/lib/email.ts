/**
 * Email Service using Emailit API
 * Sends purchase receipts and download links
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface PurchaseEmailData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  productName: string;
  amount: number;
  currency: string;
  downloadUrl?: string;
  purchaseDate: string;
}

/**
 * Send email using Emailit API
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const emailitApiKey = import.meta.env.EMAILIT_API_KEY;

  if (!emailitApiKey) {
    console.error('EMAILIT_API_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.emailit.com/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${emailitApiKey}`
      },
      body: JSON.stringify({
        from: options.from || import.meta.env.PUBLIC_EMAIL_FROM || 'noreply@yoursite.com',
        to: options.to,
        subject: options.subject,
        html: options.html
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Email send failed:', error);
      return false;
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
}

/**
 * Send purchase receipt with download link
 */
export async function sendPurchaseReceipt(data: PurchaseEmailData): Promise<boolean> {
  const subject = `Your Order ${data.orderNumber} - ${data.productName}`;
  const html = generateReceiptEmail(data);

  return sendEmail({
    to: data.customerEmail,
    subject,
    html
  });
}

/**
 * Generate receipt email HTML
 */
function generateReceiptEmail(data: PurchaseEmailData): string {
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Receipt</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 3px solid #4F46E5;
    }
    .header h1 {
      margin: 0;
      color: #4F46E5;
      font-size: 28px;
    }
    .content {
      padding: 30px 0;
    }
    .order-details {
      background: #F9FAFB;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .order-details table {
      width: 100%;
      border-collapse: collapse;
    }
    .order-details td {
      padding: 8px 0;
    }
    .order-details td:first-child {
      font-weight: 600;
      color: #6B7280;
    }
    .download-button {
      display: inline-block;
      background: #4F46E5;
      color: white !important;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .download-section {
      background: #EEF2FF;
      border: 2px solid #4F46E5;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #E5E7EB;
      text-align: center;
      color: #6B7280;
      font-size: 14px;
    }
    .price {
      font-size: 24px;
      font-weight: bold;
      color: #4F46E5;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>✅ Thank You for Your Purchase!</h1>
  </div>

  <div class="content">
    <p>Hi ${data.customerName},</p>
    <p>Your order has been confirmed and is ready! Here are your order details:</p>

    <div class="order-details">
      <table>
        <tr>
          <td>Order Number:</td>
          <td><strong>#${data.orderNumber}</strong></td>
        </tr>
        <tr>
          <td>Product:</td>
          <td><strong>${data.productName}</strong></td>
        </tr>
        <tr>
          <td>Date:</td>
          <td>${new Date(data.purchaseDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</td>
        </tr>
        <tr>
          <td>Total:</td>
          <td class="price">${formatPrice(data.amount, data.currency)}</td>
        </tr>
      </table>
    </div>

    ${data.downloadUrl ? `
      <div class="download-section">
        <h2 style="margin-top: 0; color: #4F46E5;">🎉 Your Download is Ready!</h2>
        <p>Click the button below to download your purchase:</p>
        <a href="${data.downloadUrl}" class="download-button">Download Now</a>
        <p style="margin-bottom: 0; font-size: 14px; color: #6B7280;">
          This download link will expire in 1 hour. You can download your purchase up to 5 times from your account.
        </p>
      </div>
    ` : ''}

    <p>You can access your purchase anytime from your account dashboard.</p>

    <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>

    <p>
      Best regards,<br>
      <strong>The Team</strong>
    </p>
  </div>

  <div class="footer">
    <p>This is an automated email. Please do not reply to this message.</p>
    <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
  </div>
</body>
</html>
  `;
}

/**
 * Send download link email (for re-downloads)
 */
export async function sendDownloadLink(
  customerEmail: string,
  customerName: string,
  productName: string,
  downloadUrl: string
): Promise<boolean> {
  const subject = `Download Link - ${productName}`;
  const html = generateDownloadLinkEmail(customerName, productName, downloadUrl);

  return sendEmail({
    to: customerEmail,
    subject,
    html
  });
}

/**
 * Generate download link email HTML
 */
function generateDownloadLinkEmail(
  customerName: string,
  productName: string,
  downloadUrl: string
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download Link</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 3px solid #4F46E5;
    }
    .download-button {
      display: inline-block;
      background: #4F46E5;
      color: white !important;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .download-section {
      background: #EEF2FF;
      border: 2px solid #4F46E5;
      border-radius: 8px;
      padding: 30px;
      margin: 30px 0;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📥 Your Download Link</h1>
  </div>

  <div class="content" style="padding: 30px 0;">
    <p>Hi ${customerName},</p>
    <p>Here's your download link for <strong>${productName}</strong>:</p>

    <div class="download-section">
      <a href="${downloadUrl}" class="download-button">Download Now</a>
      <p style="margin-top: 20px; font-size: 14px; color: #6B7280;">
        ⏰ This link will expire in 1 hour for security purposes.
      </p>
    </div>

    <p>If you need another download link, you can request it from your account dashboard.</p>

    <p>
      Best regards,<br>
      <strong>The Team</strong>
    </p>
  </div>
</body>
</html>
  `;
}
