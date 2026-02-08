# Switching from Mailtrap to Real Email Service

## Current Setup (Development)
- **Mailtrap**: Testing email service that intercepts all emails
- **Purpose**: Test email functionality without sending real emails
- **Limitation**: Emails don't reach real inboxes

## Option 1: Gmail SMTP (Quick & Free)

### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Name it "LS Radio"
4. Copy the 16-character password

### Step 3: Update .env
```env
# Replace Mailtrap with Gmail
MAILTRAP_HOST=smtp.gmail.com
MAILTRAP_PORT=587
MAILTRAP_USER=your-gmail@gmail.com
MAILTRAP_PASS=your-16-char-app-password
EMAIL_FROM="LS Radio <your-gmail@gmail.com>"
```

### Step 4: Update EmailService (Optional)
The current code works with Gmail, but you can make it more explicit:

```typescript
this.transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAILTRAP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});
```

## Option 2: SendGrid (Recommended for Production)

### Step 1: Sign Up
1. Go to https://sendgrid.com/
2. Sign up for free account (100 emails/day free)

### Step 2: Create API Key
1. Go to Settings → API Keys
2. Create API Key with "Mail Send" permissions
3. Copy the API key

### Step 3: Install SendGrid Package
```bash
npm install @sendgrid/mail
```

### Step 4: Update EmailService
```typescript
import sgMail from '@sendgrid/mail';

export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async sendVerificationEmail(email: string, token: string, name: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    try {
      await sgMail.send({
        to: email,
        from: process.env.EMAIL_FROM || 'noreply@lsradio.com',
        subject: 'Verify Your Email - LS Radio',
        html: this.getVerificationEmailTemplate(name, verificationUrl),
        text: `Hi ${name},\n\nPlease verify your email by clicking this link: ${verificationUrl}\n\nThis link will expire in 24 hours.\n\nBest regards,\nLS Radio Team`,
      });
      
      logger.info(`Verification email sent to ${email}`);
    } catch (error: any) {
      logger.error('Failed to send verification email', { email, error: error.message });
      throw new Error('Failed to send verification email');
    }
  }
}
```

### Step 5: Update .env
```env
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM="LS Radio <noreply@lsradio.com>"
```

## Option 3: AWS SES (Best for Scale)

### Step 1: Set Up AWS SES
1. Go to AWS Console → SES
2. Verify your domain or email address
3. Request production access (starts in sandbox mode)

### Step 2: Get SMTP Credentials
1. Go to SMTP Settings
2. Create SMTP Credentials
3. Copy username and password

### Step 3: Update .env
```env
MAILTRAP_HOST=email-smtp.us-east-1.amazonaws.com
MAILTRAP_PORT=587
MAILTRAP_USER=your-ses-smtp-username
MAILTRAP_PASS=your-ses-smtp-password
EMAIL_FROM="LS Radio <noreply@lsradio.com>"
```

## Quick Fix: Use Gmail Right Now

Want to test with real emails immediately? Update your .env:

```env
# Comment out Mailtrap
# MAILTRAP_HOST=sandbox.smtp.mailtrap.io
# MAILTRAP_PORT=2525
# MAILTRAP_USER=32d72f99378bda
# MAILTRAP_PASS=b1a8b08d56464e

# Use Gmail instead
MAILTRAP_HOST=smtp.gmail.com
MAILTRAP_PORT=587
MAILTRAP_USER=adeyemoakinola2@gmail.com
MAILTRAP_PASS=your-gmail-app-password
EMAIL_FROM="LS Radio <adeyemoakinola2@gmail.com>"
```

Then restart your server!

## Testing Checklist

After switching to real email service:

1. ✅ Register new user
2. ✅ Check email inbox (not Mailtrap)
3. ✅ Click verification link
4. ✅ Verify email is marked as verified
5. ✅ Login successfully
6. ✅ Receive welcome email

## Important Notes

- **Gmail Limits**: 500 emails/day for free accounts
- **SendGrid Free**: 100 emails/day
- **AWS SES**: Very cheap, pay per email
- **Production**: Use SendGrid or AWS SES, not Gmail
- **Domain**: For production, use your own domain email (noreply@yourdomain.com)

## Troubleshooting

### Gmail "Less secure app" error
- Solution: Use App Password (not regular password)
- Enable 2FA first, then generate App Password

### SendGrid emails going to spam
- Solution: Verify your domain and set up SPF/DKIM records

### AWS SES sandbox mode
- Solution: Request production access in AWS Console
- In sandbox, can only send to verified emails
