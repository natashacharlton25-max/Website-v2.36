# Email Downloads & Authentication System - TODO

**Priority**: High
**Status**: Planning Phase
**Last Updated**: 2024-12-24

---

## Overview

Implement a complete email delivery system for free downloadable resources with optional user authentication, utilizing Hostinger MySQL database and Emaillit API for email delivery.

---

## Tech Stack

- **Database**: Hostinger MySQL
- **Email Service**: Emaillit API
- **Authentication**: Custom JWT-based system (optional login)
- **File Storage**: Hostinger file system or cloud storage (TBD)
- **Frontend**: Astro with existing checkout flow

---

## Phase 1: Email Delivery System (No Login Required)

### 1.1 Database Schema

**Tables to Create**:

```sql
-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- Download requests (tracks what users requested)
CREATE TABLE download_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMP NULL,
  download_count INT DEFAULT 0,
  last_download_at TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_product (product_id)
);

-- Email delivery log
CREATE TABLE email_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  template_name VARCHAR(100) NOT NULL,
  subject VARCHAR(255),
  status ENUM('sent', 'failed', 'pending') DEFAULT 'pending',
  emaillit_response JSON,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  error_message TEXT NULL,
  INDEX idx_email (email),
  INDEX idx_status (status)
);
```

### 1.2 Emaillit API Integration

**Files to Create/Update**:

- `src/lib/email/emaillit-client.ts` - Emaillit API wrapper
- `src/lib/email/email-templates.ts` - Template configurations
- `src/pages/api/newsletter-signup.ts` - Newsletter signup endpoint
- `src/pages/api/send-downloads.ts` - Download links delivery endpoint

**Environment Variables**:
```env
# .env
EMAILLIT_API_KEY=your_emaillit_api_key
EMAILLIT_FROM_EMAIL=downloads@walkingwithasmile.com
EMAILLIT_FROM_NAME=Walking with a Smile

DATABASE_HOST=your_hostinger_host
DATABASE_NAME=your_database_name
DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_database_password
```

**Emaillit Client Structure**:
```typescript
// src/lib/email/emaillit-client.ts
interface EmailData {
  to: string;
  subject: string;
  template: string;
  variables: Record<string, any>;
}

async function sendEmail(data: EmailData): Promise<boolean>
async function sendDownloadLinks(email: string, downloads: Array<{name: string, url: string}>): Promise<boolean>
async function sendWelcomeEmail(email: string, firstName: string): Promise<boolean>
```

### 1.3 Email Templates

**Templates to Design**:

1. **Welcome Email** (`welcome-email.html`)
   - Thank you message
   - What to expect
   - Link to browse more resources

2. **Download Links Email** (`download-links.html`)
   - Personalized greeting
   - List of requested downloads with download buttons
   - Download instructions
   - Footer with social links and unsubscribe

3. **Newsletter Confirmation** (`newsletter-confirm.html`)
   - Subscription confirmation
   - What they'll receive
   - Preferences link

**Template Folder Structure**:
```
src/email-templates/
  layouts/
    base.html              # Base layout with header/footer
  templates/
    welcome-email.html
    download-links.html
    newsletter-confirm.html
  styles/
    email-inline.css       # Inline-able styles for email clients
  images/
    logo.png
    footer-bg.png
```

### 1.4 API Endpoints

**Endpoints to Create**:

1. **POST `/api/newsletter-signup`**
   - Validates email
   - Stores in newsletter_subscribers table
   - Sends welcome email via Emaillit
   - Returns success/error

2. **POST `/api/send-downloads`**
   - Receives: email, firstName, lastName, downloads[]
   - Stores in download_requests table
   - Generates/retrieves download links
   - Sends download email via Emaillit
   - Logs to email_log table
   - Returns success/error

3. **GET `/api/download/[token]`**
   - Validates download token
   - Increments download_count
   - Updates last_download_at
   - Returns file or redirect to file URL

### 1.5 Update Checkout Flow

**Update Files**:
- `src/scripts/checkout-form.ts` - Replace TODO with actual API call
- `src/components/Checkout/NewsletterForm.astro` - Create component (pending)

**New Checkout Flow**:
1. User fills form (firstName, lastName, email, newsletter checkbox)
2. Client-side validation
3. POST to `/api/send-downloads` with form data + cart items
4. API stores data, sends email via Emaillit
5. Success: Clear cart, redirect to thank you page
6. Error: Show error message, keep form data

---

## Phase 2: Optional Login System

### 2.1 Additional Database Tables

```sql
-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP NULL,
  INDEX idx_email (email)
);

-- Email verification tokens
CREATE TABLE verification_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token)
);

-- User downloads (for logged-in users)
CREATE TABLE user_downloads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  download_count INT DEFAULT 0,
  last_download_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_product (product_id)
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token)
);
```

### 2.2 Authentication Endpoints

**Endpoints to Create**:

1. **POST `/api/auth/register`**
2. **POST `/api/auth/login`**
3. **POST `/api/auth/logout`**
4. **GET `/api/auth/verify-email/[token]`**
5. **POST `/api/auth/forgot-password`**
6. **POST `/api/auth/reset-password`**
7. **GET `/api/auth/me`** - Get current user

### 2.3 User Dashboard

**Pages to Create**:

- `src/pages/account/dashboard.astro` - User dashboard
- `src/pages/account/downloads.astro` - My downloads
- `src/pages/account/settings.astro` - Account settings
- `src/pages/account/login.astro` - Login page
- `src/pages/account/register.astro` - Registration page
- `src/pages/account/forgot-password.astro` - Password reset

### 2.4 Additional Email Templates

1. **Email Verification** (`verify-email.html`)
2. **Password Reset** (`password-reset.html`)
3. **Password Changed Confirmation** (`password-changed.html`)
4. **New Login Alert** (`new-login-alert.html`) - Optional security feature

---

## Phase 3: File Management & Download Security

### 3.1 Download Token System

**Generate Secure Download Links**:
```typescript
// Generate time-limited, single-use download tokens
interface DownloadToken {
  productId: string;
  email: string;
  expiresAt: Date;
  maxUses: number;
}

function generateDownloadToken(productId: string, email: string): string
function validateDownloadToken(token: string): Promise<DownloadToken | null>
```

### 3.2 File Storage Options

**Option A: Hostinger File System**
- Store files in protected directory outside public root
- Use API endpoint to serve files after token validation
- Pros: Simple, no extra cost
- Cons: Server bandwidth, limited scalability

**Option B: Cloud Storage (Cloudflare R2 / AWS S3)**
- Generate pre-signed URLs for downloads
- Pros: Scalable, offload bandwidth
- Cons: Additional cost, more complex setup

**Recommended**: Start with Option A, migrate to Option B if needed

### 3.3 Download Tracking

**Track in database**:
- Download count per user/email
- Last download timestamp
- User agent (optional)
- IP address (optional, for abuse prevention)

---

## Phase 4: Email Marketing & Analytics

### 4.1 Emaillit Campaign Integration

**Newsletter Features**:
- Monthly resource roundup emails
- New resource announcements
- Targeted campaigns based on downloaded resources

### 4.2 Analytics Dashboard

**Metrics to Track**:
- Newsletter signup rate
- Download request volume
- Email open rates (via Emaillit)
- Download completion rates
- Most popular resources
- User retention

---

## Implementation Order (Recommended)

### Sprint 1: Core Email Delivery (Week 1-2)
- [ ] Set up Hostinger MySQL database
- [ ] Create database schema (Phase 1 tables)
- [ ] Implement Emaillit client wrapper
- [ ] Design email templates (welcome + downloads)
- [ ] Create API endpoints for newsletter & downloads
- [ ] Update checkout form to call real API
- [ ] Test end-to-end flow

### Sprint 2: Email Templates & UX (Week 3)
- [ ] Design professional email templates
- [ ] Create thank you page after checkout
- [ ] Add email preview functionality (admin)
- [ ] Implement email logging and error tracking
- [ ] Add rate limiting to prevent abuse

### Sprint 3: Authentication System (Week 4-5)
- [ ] Implement user registration/login
- [ ] Create verification email flow
- [ ] Build user dashboard
- [ ] Add password reset functionality
- [ ] Create my downloads page

### Sprint 4: Polish & Security (Week 6)
- [ ] Implement download token system
- [ ] Add CAPTCHA to prevent bot signups
- [ ] Security audit (SQL injection, XSS prevention)
- [ ] Performance optimization
- [ ] Analytics dashboard

---

## Security Considerations

### Critical Security Measures

1. **Email Validation**
   - Verify email format
   - Check for disposable email domains
   - Implement rate limiting per IP/email

2. **Download Protection**
   - Time-limited tokens (24-48 hours)
   - Single-use or limited-use tokens
   - No direct file URLs in emails

3. **SQL Injection Prevention**
   - Use parameterized queries
   - Never concatenate user input into SQL

4. **Password Security** (Phase 2)
   - bcrypt/argon2 for password hashing
   - Minimum password requirements
   - Account lockout after failed attempts

5. **CAPTCHA**
   - Add to checkout form
   - Add to registration/login

6. **Rate Limiting**
   - Limit API requests per IP
   - Limit emails sent per address per day

---

## Environment Setup Checklist

- [ ] Hostinger database created
- [ ] Database user with proper permissions
- [ ] Emaillit account set up
- [ ] API key generated
- [ ] Domain email configured (downloads@walkingwithasmile.com)
- [ ] Environment variables added to `.env`
- [ ] `.env` added to `.gitignore`
- [ ] Test database credentials locally
- [ ] Test Emaillit API connection

---

## Testing Checklist

### Email Delivery Tests
- [ ] Newsletter signup sends welcome email
- [ ] Checkout sends download links email
- [ ] Emails render correctly in Gmail, Outlook, Apple Mail
- [ ] Links in emails work correctly
- [ ] Unsubscribe link works
- [ ] Email logs are recorded

### Authentication Tests (Phase 2)
- [ ] User can register and receive verification email
- [ ] User can verify email via link
- [ ] User can login with correct credentials
- [ ] User cannot login with incorrect credentials
- [ ] Password reset flow works end-to-end
- [ ] Protected routes require authentication

### Download Tests
- [ ] Download tokens expire correctly
- [ ] Download count increments
- [ ] Invalid tokens are rejected
- [ ] Files download correctly

---

## Resources & Documentation

**Emaillit API**:
- API Documentation: [https://emaillit.com/docs]
- API Key Management: [Emaillit Dashboard]

**Hostinger Database**:
- Database Management: [Hostinger Control Panel]
- PHPMyAdmin access
- Connection details in hosting panel

**Email Template Design**:
- MJML framework (responsive email templates)
- Litmus or Email on Acid (email testing tools)
- Can I Email? (CSS support reference)

**Security Resources**:
- OWASP Top 10 (security best practices)
- JWT Best Practices
- Password hashing guidelines

---

## Future Enhancements

### Nice-to-Have Features
- [ ] Email preference center
- [ ] Download history export
- [ ] Social login (Google, Microsoft)
- [ ] Two-factor authentication
- [ ] Download analytics for users
- [ ] Personalized resource recommendations
- [ ] Email A/B testing
- [ ] Automated email sequences
- [ ] Admin dashboard for email campaigns

### Scalability Considerations
- [ ] Move to cloud storage for files
- [ ] Implement CDN for downloads
- [ ] Database query optimization
- [ ] Email queue system for high volume
- [ ] Microservice architecture (if needed)

---

## Notes

- Keep download links simple and accessible without login for better user experience
- Optional login provides value-add features (history, preferences) without friction
- Email deliverability is critical - monitor spam scores and sender reputation
- GDPR compliance: Clear consent, easy unsubscribe, data export/deletion
- Consider email backup strategy for critical transactional emails

---

**Next Step**: Begin Sprint 1 after website build is complete and live on Hostinger.
