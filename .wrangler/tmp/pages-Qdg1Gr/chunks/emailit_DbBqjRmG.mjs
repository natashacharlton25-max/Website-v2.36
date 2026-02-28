globalThis.process ??= {}; globalThis.process.env ??= {};
function getConfig() {
  const apiKey = "em_G76hu6XLag1VZPpiLdeXxxC4wqmCRLtH";
  const apiUrl = "https://api.emailit.com/v1/emails";
  return { apiKey, apiUrl };
}
async function sendEmail(options) {
  const { apiKey, apiUrl } = getConfig();
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Walking with a Smile <hello@nslc.pro>",
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || stripHtml(options.html)
      })
    });
    if (!response.ok) {
      const error = await response.text();
      console.error("Emailit API error:", error);
      return { success: false, message: error };
    }
    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, message: String(error) };
  }
}
function stripHtml(html) {
  return html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}
const BRAND_COLORS = {
  background: "#f9f8f6",
  text: "#474747",
  textLight: "#6b7280",
  primary: "#8fa68a",
  // Sage green
  primaryDark: "#7a9175",
  // Terracotta
  white: "#ffffff",
  border: "#e8e6e3",
  highlight: "#f0ebe6"
};
function emailTemplate(content, footerNote) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>Walking with a Smile</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset */
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }

    /* Base */
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

    /* Header */
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
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    .tagline {
      font-size: 13px;
      color: rgba(255,255,255,0.85);
      margin: 8px 0 0 0;
      letter-spacing: 0.3px;
    }

    /* Content */
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

    p {
      color: ${BRAND_COLORS.text};
      font-size: 15px;
      margin: 0 0 16px 0;
      line-height: 1.7;
    }

    /* Button */
    .button-wrapper {
      text-align: center;
      margin: 28px 0;
    }

    .button {
      display: inline-block;
      background: ${BRAND_COLORS.primary};
      color: ${BRAND_COLORS.white} !important;
      text-decoration: none;
      padding: 14px 36px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0.3px;
      transition: background 0.2s;
    }

    /* Download list */
    .download-list {
      background: ${BRAND_COLORS.highlight};
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
    }

    .download-item {
      display: block;
      padding: 14px 16px;
      background: ${BRAND_COLORS.white};
      border-radius: 8px;
      margin-bottom: 10px;
      border: 1px solid ${BRAND_COLORS.border};
      text-decoration: none;
    }

    .download-item:last-child {
      margin-bottom: 0;
    }

    .download-name {
      font-weight: 500;
      color: ${BRAND_COLORS.text};
      font-size: 14px;
      display: block;
      margin-bottom: 4px;
    }

    .download-action {
      color: ${BRAND_COLORS.primary};
      font-size: 13px;
      font-weight: 600;
    }

    /* Info box */
    .info-box {
      background: ${BRAND_COLORS.highlight};
      border-radius: 12px;
      padding: 20px 24px;
      margin: 24px 0;
    }

    .info-row {
      margin-bottom: 10px;
    }

    .info-row:last-child {
      margin-bottom: 0;
    }

    .info-label {
      font-weight: 600;
      color: ${BRAND_COLORS.text};
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: block;
      margin-bottom: 2px;
    }

    .info-value {
      color: ${BRAND_COLORS.textLight};
      font-size: 15px;
    }

    /* Message box */
    .message-box {
      background: linear-gradient(135deg, rgba(143,166,138,0.1) 0%, rgba(196,144,124,0.1) 100%);
      border-left: 4px solid ${BRAND_COLORS.primary};
      border-radius: 0 12px 12px 0;
      padding: 20px 24px;
      margin: 24px 0;
    }

    .message-box p {
      margin: 0;
      font-style: italic;
      color: ${BRAND_COLORS.textLight};
    }

    /* Note/Alert */
    .note {
      background: linear-gradient(135deg, rgba(196,144,124,0.15) 0%, rgba(196,144,124,0.08) 100%);
      border: 1px solid rgba(196,144,124,0.3);
      border-radius: 12px;
      padding: 16px 20px;
      font-size: 14px;
      color: #8b6b5a;
      margin: 24px 0;
    }

    .note strong {
      color: #7a5c4d;
    }

    /* Divider */
    .divider {
      height: 1px;
      background: ${BRAND_COLORS.border};
      margin: 32px 0;
    }

    /* Footer */
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

    /* Responsive */
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
          <a href="https://walkingwithasmile.com">Visit Website</a>
          <a href="https://walkingwithasmile.com/assets">Resources</a>
          <a href="https://walkingwithasmile.com/contact">Contact</a>
        </p>
        <p class="footer-note">${footerNote}</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
async function sendVerificationEmail(email, firstName, verificationToken, siteUrl) {
  const verifyUrl = `${siteUrl}/verify?token=${verificationToken}`;
  const content = `
    <h1>Let's verify your email</h1>
    <p>Hi ${firstName},</p>
    <p>Thank you for your interest in our resources! We just need to quickly verify your email address, then your downloads will be on their way.</p>
    <div class="button-wrapper">
      <a href="${verifyUrl}" class="button">Verify My Email</a>
    </div>
    <p style="font-size: 13px; color: ${BRAND_COLORS.textLight};">Or copy this link into your browser:</p>
    <p style="word-break: break-all; font-size: 13px; color: ${BRAND_COLORS.textLight}; background: ${BRAND_COLORS.highlight}; padding: 12px 16px; border-radius: 8px;">${verifyUrl}</p>
    <div class="note">
      <strong>This link expires in 24 hours.</strong><br>
      If you didn't request this, you can safely ignore this email.
    </div>
  `;
  return sendEmail({
    to: email,
    subject: "Verify your email to get your downloads",
    html: emailTemplate(content, "You received this email because you requested downloads from our website.")
  });
}
async function sendDownloadEmail(email, firstName, downloads, tier, remaining) {
  const downloadItems = downloads.map((d) => `
    <a href="${d.url}" class="download-item">
      <span class="download-name">${d.name}</span>
      <span class="download-action">Click to download →</span>
    </a>
  `).join("");
  const remainingText = remaining === Infinity ? "You have unlimited downloads as a VIP member!" : `You have ${remaining} download${remaining !== 1 ? "s" : ""} remaining this month.`;
  const content = `
    <h1>Your downloads are ready</h1>
    <p>Hi ${firstName},</p>
    <p>Great news! Your email has been verified and your resources are ready. Simply click the links below to download your files:</p>
    <div class="download-list">
      ${downloadItems}
    </div>
    <div class="note">
      <strong>These links expire in 7 days.</strong><br>
      ${remainingText}
    </div>
    <div class="divider"></div>
    <p>We hope these resources support you on your journey. If you have any questions or need guidance on using them, don't hesitate to reach out.</p>
    <p style="color: ${BRAND_COLORS.textLight};">With warmth,<br><strong>The Walking with a Smile Team</strong></p>
  `;
  return sendEmail({
    to: email,
    subject: `Your ${downloads.length} download${downloads.length !== 1 ? "s are" : " is"} ready`,
    html: emailTemplate(content, "You received this email because you requested downloads from our website.")
  });
}
async function sendExistingUserDownloadEmail(email, firstName, downloads, tier, remaining) {
  const downloadItems = downloads.map((d) => `
    <a href="${d.url}" class="download-item">
      <span class="download-name">${d.name}</span>
      <span class="download-action">Click to download →</span>
    </a>
  `).join("");
  const remainingText = remaining === Infinity ? "You have unlimited downloads as a VIP member!" : `You have ${remaining} download${remaining !== 1 ? "s" : ""} remaining this month.`;
  const content = `
    <h1>Welcome back! Your downloads are ready</h1>
    <p>Hi ${firstName},</p>
    <p>Great to see you again! Since you're already verified, your resources are ready to go. Simply click below to download:</p>
    <div class="download-list">
      ${downloadItems}
    </div>
    <div class="note">
      <strong>These links expire in 7 days.</strong><br>
      ${remainingText}
    </div>
    <div class="divider"></div>
    <p>Thank you for being part of our community. We're honoured to support you on your journey.</p>
    <p style="color: ${BRAND_COLORS.textLight};">With warmth,<br><strong>The Walking with a Smile Team</strong></p>
  `;
  return sendEmail({
    to: email,
    subject: `Your ${downloads.length} download${downloads.length !== 1 ? "s are" : " is"} ready`,
    html: emailTemplate(content, "You received this email because you requested downloads from our website.")
  });
}
async function sendLimitReachedEmail(email, firstName, tier, limit, resetDate) {
  const formattedDate = resetDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
  const upgradeSection = tier === "free" ? `
      <div class="info-box">
        <p style="margin: 0;"><strong>Want more downloads?</strong></p>
        <p style="margin: 8px 0 0 0;">Subscribe to our newsletter to unlock 10 downloads per month — completely free!</p>
      </div>
    ` : tier === "newsletter" ? `
      <div class="info-box">
        <p style="margin: 0;"><strong>Need more resources?</strong></p>
        <p style="margin: 8px 0 0 0;">Upgrade to a subscription for 20 downloads per month, or become a VIP member for unlimited access to all our resources.</p>
      </div>
    ` : "";
  const content = `
    <h1>You've reached your download limit</h1>
    <p>Hi ${firstName},</p>
    <p>It looks like you've used all ${limit} of your monthly downloads. Don't worry — your limit will automatically reset on <strong>${formattedDate}</strong>.</p>
    ${upgradeSection}
    <div class="divider"></div>
    <p>In the meantime, feel free to explore our insights and articles, or reach out if you have any questions.</p>
    <p style="color: ${BRAND_COLORS.textLight};">Take care,<br><strong>The Walking with a Smile Team</strong></p>
  `;
  return sendEmail({
    to: email,
    subject: "Monthly download limit reached",
    html: emailTemplate(content, "You received this email because you requested downloads from our website.")
  });
}

export { sendExistingUserDownloadEmail as a, sendVerificationEmail as b, sendDownloadEmail as c, sendLimitReachedEmail as s };
