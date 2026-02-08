# Using Mailtrap for Production Email Delivery

## Current Setup (Sandbox - Testing Only)
- **Host**: `sandbox.smtp.mailtrap.io`
- **Purpose**: Testing - emails are intercepted and stored in Mailtrap inbox
- **Limitation**: Emails DON'T reach real inboxes

## ✅ Switch to Mailtrap Production (Recommended)

Mailtrap has a production service that delivers emails to real inboxes!

### Step 1: Get Production Credentials
1. Login to https://mailtrap.io/
2. Go to **Email API/SMTP** section (not Email Testing)
3. Click on **SMTP Settings**
4. Copy your production credentials

### Step 2: Update .env File
```env
# Replace these lines:
# MAILTRAP_HOST=sandbox.smtp.mailtrap.io
# MAILTRAP_PORT=2525
# MAILTRAP_USER=32d72f99378bda
# MAILTRAP_PASS=b1a8b08d56464e

# With production Mailtrap:
MAILTRAP_HOST=live.smtp.mailtrap.io
MAILTRAP_PORT=587
MAILTRAP_USER=your-production-username
MAILTRAP_PASS=your-production-password
EMAIL_FROM="LS Radio <noreply@yourdomain.com>"
```

### Step 3: Restart Your Server
```bash
# Kill current server (Ctrl+C)
npm run dev
```

### Step 4: Test
Register a new user with your real email address - you'll receive the email in your actual inbox!

## Mailtrap Production Features

✅ **Real Email Delivery** - Emails reach actual inboxes
✅ **Free Plan** - 1,000 emails/month
✅ **Analytics** - Track opens, clicks, bounces
✅ **IP Warmup** - Automatic for better deliverability
✅ **Suppression Lists** - Manage bounces and complaints
✅ **No Code Changes** - Same Nodemailer setup works!

## Pricing
- **Free**: 1,000 emails/month
- **Starter**: $10/month - 10,000 emails
- **Business**: $75/month - 100,000 emails

## Alternative Options

### Gmail SMTP (Free, 500 emails/day)
```env
MAILTRAP_HOST=smtp.gmail.com
MAILTRAP_PORT=587
MAILTRAP_USER=your-gmail@gmail.com
MAILTRAP_PASS=your-16-char-app-password
```

### SendGrid (Free, 100 emails/day)
```env
SENDGRID_API_KEY=your-api-key
```

### AWS SES (Pay per email, very cheap)
```env
MAILTRAP_HOST=email-smtp.us-east-1.amazonaws.com
MAILTRAP_PORT=587
MAILTRAP_USER=your-ses-username
MAILTRAP_PASS=your-ses-password
```

## Quick Comparison

| Service | Free Tier | Best For |
|---------|-----------|----------|
| **Mailtrap Production** | 1,000/month | Easy setup, analytics |
| Gmail | 500/day | Quick testing |
| SendGrid | 100/day | Marketing emails |
| AWS SES | Pay per email | High volume |

## Why Mailtrap Production?

1. **No Code Changes** - Just update .env file
2. **Same Interface** - Already familiar with Mailtrap
3. **Better Analytics** - Track email performance
4. **Reliable Delivery** - Built-in IP warmup
5. **Easy Migration** - Sandbox → Production seamlessly

## Current Status

Your emails ARE being sent successfully (logs show "Verification email sent"), but they're going to the **sandbox inbox** instead of real email addresses.

To view sandbox emails:
- Go to https://mailtrap.io/inboxes
- Login and check your inbox

To send to real emails:
- Switch to `live.smtp.mailtrap.io` as shown above
