# Email Service Setup with Mailtrap

This project uses **Mailtrap** with **Nodemailer** for email functionality.

## Features

- ✅ Email verification on user registration
- ✅ Welcome email after verification
- ✅ Password reset emails
- ✅ Beautiful HTML email templates
- ✅ Automatic token generation and expiration

## Setup Instructions

### 1. Get Mailtrap Credentials

1. Go to [Mailtrap.io](https://mailtrap.io/)
2. Sign up for a free account
3. Navigate to **Email Testing** → **Inboxes**
4. Select your inbox (or create a new one)
5. Go to **SMTP Settings** tab
6. Copy the credentials:
   - Host: `sandbox.smtp.mailtrap.io`
   - Port: `2525`
   - Username: Your Mailtrap username
   - Password: Your Mailtrap password

### 2. Configure Environment Variables

Add these variables to your `.env` file:

```env
# Email Configuration (Mailtrap)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your-mailtrap-username
MAILTRAP_PASS=your-mailtrap-password
EMAIL_FROM="LS Radio <noreply@lsradio.com>"
FRONTEND_URL=http://localhost:3000
```

### 3. Email Flow

#### User Registration
1. User registers with email and password
2. System creates user account with `emailVerified: false`
3. Verification token is generated and stored in database
4. Verification email is sent with a link containing the token
5. Token expires in 24 hours

#### Email Verification
1. User clicks verification link in email
2. System validates token and expiration
3. User's `emailVerified` field is set to `true`
4. Welcome email is sent
5. User is redirected to login page with success message

#### Password Reset
1. User requests password reset
2. Reset token is generated and stored
3. Password reset email is sent with link
4. Token expires in 1 hour
5. User clicks link and sets new password

## API Endpoints

### Register User
```
POST /api/auth/register
Body: { email, password, name, username?, bio? }
Response: { message: "User account created. Verification email sent." }
```

### Verify Email (POST)
```
POST /api/auth/verify-email
Body: { token }
Response: { message: "Email verified successfully" }
```

### Verify Email (GET - from email link)
```
GET /api/auth/verify-email/:token
Redirects to: /login?verified=true
```

### Forgot Password
```
POST /api/auth/forgot-password
Body: { email }
Response: { message: "Password reset link sent to your email" }
```

### Reset Password
```
POST /api/auth/reset-password
Body: { token, password }
Response: { message: "Password reset successfully" }
```

## Email Templates

The service includes three beautiful HTML email templates:

1. **Verification Email** - Sent on registration
2. **Password Reset Email** - Sent on forgot password
3. **Welcome Email** - Sent after email verification

All templates are responsive and include:
- Branded header with gradient
- Clear call-to-action buttons
- Fallback plain text links
- Professional footer
- Expiration warnings

## Testing

### Using Mailtrap
1. Register a new user
2. Check your Mailtrap inbox
3. You'll see the verification email
4. Click the verification link
5. Check for the welcome email

### Manual Testing
```bash
# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Check Mailtrap inbox for verification email
# Click the link or use the token

# Verify email
curl -X POST http://localhost:3001/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token":"your-token-here"}'
```

## Production Setup

For production, replace Mailtrap with a real email service:

1. **SendGrid**
2. **AWS SES**
3. **Mailgun**
4. **Postmark**

Update the transporter configuration in `email.service.ts`:

```typescript
this.transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
```

## Troubleshooting

### Emails not sending
- Check Mailtrap credentials in `.env`
- Verify `FRONTEND_URL` is correct
- Check server logs for email errors
- Ensure Mailtrap inbox is not full

### Token expired
- Verification tokens expire in 24 hours
- Password reset tokens expire in 1 hour
- Request a new token if expired

### Email not verified
- User must click verification link before logging in
- Check `emailVerified` field in database
- Resend verification email if needed

## Security Notes

- Tokens are randomly generated and unique
- Tokens are deleted after use
- Expired tokens are rejected
- Password reset tokens have shorter expiration
- Email verification is required before login
