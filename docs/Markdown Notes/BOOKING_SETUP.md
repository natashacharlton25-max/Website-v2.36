# Booking System Setup Guide

Complete guide to setting up the booking system with Supabase, Stripe payments, and Google Calendar integration.

## Quick Start

1. Visit `/booking` to see the booking page
2. The system works in demo mode without any configuration
3. Follow the sections below to enable full functionality

---

## 1. Supabase Setup (Database)

### Create Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be ready (~2 minutes)

### Run Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy the contents of `supabase/booking-schema.sql` and paste it
4. Click **Run** to create the tables

### Get API Keys
1. Go to **Settings > API**
2. Copy the following values:
   - **Project URL** → `PUBLIC_SUPABASE_URL`
   - **anon public key** → `PUBLIC_SUPABASE_ANON_KEY`

### Add to Environment
Add these to your `.env` file:
```env
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 2. Stripe Setup (Payments)

### Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the business verification (can use test mode before this)

### Get API Keys
1. Go to **Developers > API Keys**
2. Copy:
   - **Publishable key** → `PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

### Add to Environment
```env
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Enable Payments in Code
In `src/pages/booking.astro`, change:
```javascript
const requirePayment = true;  // Enable Stripe payments
```

---

## 3. Google Calendar Setup (Optional)

### Create Google Cloud Project
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Go to **APIs & Services > Library**
4. Search for and enable **Google Calendar API**

### Create Service Account
1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > Service Account**
3. Name it (e.g., "booking-calendar")
4. Click **Done**
5. Click on the service account email
6. Go to **Keys > Add Key > Create new key > JSON**
7. Download the JSON file

### Share Your Calendar
1. Open [Google Calendar](https://calendar.google.com)
2. Click the ⚙️ next to your calendar > **Settings and sharing**
3. Under **Share with specific people**, add the service account email
4. Give it **Make changes to events** permission

### Add to Environment
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=your-email@gmail.com
```

> **Note**: The private key should be the full key from the JSON file, with `\n` for newlines.

### Enable Google Meet Links
The API endpoint automatically creates Meet links. To use them, ensure:
1. Your Google Workspace or personal account has Meet enabled
2. The service account has proper calendar permissions

---

## 4. Email Reminders (Optional)

### Option A: Use Google Calendar Built-in Reminders
- Calendar events automatically include reminders
- Attendees receive email 24h and 1h before appointments

### Option B: Custom Emails with Resend
1. Create account at [resend.com](https://resend.com)
2. Get API key and add: `RESEND_API_KEY=re_...`
3. Create a Supabase Edge Function to send reminders

Example Edge Function (save as `supabase/functions/send-reminder/index.ts`):
```typescript
import { Resend } from 'resend';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

Deno.serve(async (req) => {
  const { to, bookingDate, bookingTime, serviceName } = await req.json();

  await resend.emails.send({
    from: 'bookings@yourdomain.com',
    to,
    subject: 'Appointment Reminder',
    html: `
      <h2>Reminder: Your appointment is tomorrow!</h2>
      <p><strong>Service:</strong> ${serviceName}</p>
      <p><strong>Date:</strong> ${bookingDate}</p>
      <p><strong>Time:</strong> ${bookingTime}</p>
    `
  });

  return new Response('Sent', { status: 200 });
});
```

---

## 5. Customization

### Change Services
Edit `src/pages/booking.astro`:
```javascript
const services = [
  { id: 'haircut', name: 'Haircut', duration: 30, price: 35 },
  { id: 'color', name: 'Hair Color', duration: 90, price: 120 },
  // Add more services...
];
```

### Change Time Slots
```javascript
const timeSlots = [
  '08:00', '08:30', '09:00', '09:30',
  // Add/remove times as needed
];
```

### Change Available Months Ahead
```astro
<BookingCalendar maxMonthsAhead={6} />  <!-- 6 months ahead -->
```

### Styling
All components use CSS variables from your theme:
- `--color-Primary-500` - Main accent color
- `--color-Text-800` - Primary text
- `--color-Background-50` - Page background

---

## Environment Variables Summary

```env
# Supabase (Required for persistence)
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Stripe (Optional - for payments)
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Google Calendar (Optional - for calendar sync)
GOOGLE_SERVICE_ACCOUNT_EMAIL=service@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=your-email@gmail.com

# Email (choose one option)
# Option A: Gmail API (free - uses Google credentials above)
EMAIL_FROM=your-gmail@gmail.com
EMAIL_FROM_NAME=Your Business Name

# Option B: Emailit (custom domain)
EMAILIT_API_KEY=your-emailit-api-key

# Option C: Resend (100/day free)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

---

## 5. Email Setup

The booking system sends confirmation emails with attached .ics calendar files. Choose one of three options:

### Option A: Gmail API (FREE - Recommended)
Uses the same Google credentials as Calendar integration. Completely free!

1. Complete the Google Calendar setup (Section 3)
2. Enable **Gmail API** in Google Cloud Console (APIs & Services > Library)
3. Grant the service account domain-wide delegation:
   - Go to Google Admin Console (admin.google.com)
   - Security > API controls > Domain-wide delegation
   - Add the service account client ID
   - Add scope: `https://www.googleapis.com/auth/gmail.send`
4. Add to environment:
```env
EMAIL_FROM=your-gmail@gmail.com
EMAIL_FROM_NAME=Your Business Name
```

**Note**: For personal Gmail accounts without Google Workspace, you may need to use OAuth2 instead of service accounts. The service account delegation works best with Google Workspace accounts.

### Option B: Emailit (Custom Domain)
For sending from a custom domain like `bookings@yourdomain.com`:

1. Go to [emailit.com](https://emailit.com) and sign up
2. Verify your sending domain
3. Go to **API Keys** and create a new key

```env
EMAILIT_API_KEY=your-emailit-api-key
EMAIL_FROM=bookings@yourdomain.com
EMAIL_FROM_NAME=Your Business Name
```

### Option C: Resend (Free Tier Available)
100 emails/day free, custom domain support:

1. Create account at [resend.com](https://resend.com)
2. Verify your domain
3. Get API key

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=bookings@yourdomain.com
EMAIL_FROM_NAME=Your Business Name
```

### Features Included
- HTML confirmation email with booking details
- .ics calendar file attachment (works with Google Calendar, Apple Calendar, Outlook)
- Google Meet link included for video calls
- Automatic reminders (1 day and 1 hour before)

---

## Troubleshooting

### "Supabase not configured" warning
- Make sure `.env` file exists with correct values
- Restart the dev server after changing `.env`

### Calendar events not creating
- Verify the service account has access to your calendar
- Check that the private key is formatted correctly in `.env`

### Payments not working
- Check Stripe dashboard for errors
- Ensure you're using test keys in development
- Verify the API endpoint is accessible

### Time slots not showing
- Select a date first on the calendar
- Check browser console for errors
- Verify Supabase connection

---

## Architecture

```
User selects date/time
        ↓
BookingCalendar → TimeSlotPicker → BookingForm
        ↓
    Supabase (save booking)
        ↓
    Stripe (process payment, if enabled)
        ↓
    Google Calendar (create event + Meet link)
        ↓
    Email confirmation (via Calendar or Resend)
```

---

## Support

For issues with:
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Stripe**: [stripe.com/docs](https://stripe.com/docs)
- **Google Calendar API**: [developers.google.com/calendar](https://developers.google.com/calendar)
