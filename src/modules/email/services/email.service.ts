import nodemailer from 'nodemailer';
import logger from '../../../utils/logger';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
      port: parseInt(process.env.MAILTRAP_PORT || '2525'),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string, name: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'LS Radio <noreply@lsradio.com>',
        to: email,
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

  async sendPasswordResetEmail(email: string, token: string, name: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'LS Radio <noreply@lsradio.com>',
        to: email,
        subject: 'Reset Your Password - LS Radio',
        html: this.getPasswordResetEmailTemplate(name, resetUrl),
        text: `Hi ${name},\n\nYou requested to reset your password. Click this link: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nLS Radio Team`,
      });
      
      logger.info(`Password reset email sent to ${email}`);
    } catch (error: any) {
      logger.error('Failed to send password reset email', { email, error: error.message });
      throw new Error('Failed to send password reset email');
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'LS Radio <noreply@lsradio.com>',
        to: email,
        subject: 'Welcome to LS Radio!',
        html: this.getWelcomeEmailTemplate(name),
        text: `Hi ${name},\n\nWelcome to LS Radio! Your email has been verified successfully.\n\nYou can now enjoy all our features including podcasts, live broadcasts, and more.\n\nBest regards,\nLS Radio Team`,
      });
      
      logger.info(`Welcome email sent to ${email}`);
    } catch (error: any) {
      logger.error('Failed to send welcome email', { email, error: error.message });
    }
  }

  async sendStaffRegistrationEmail(email: string, name: string, role: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'LS Radio <noreply@lsradio.com>',
        to: email,
        subject: 'Staff Account Created - LS Radio',
        html: this.getStaffRegistrationEmailTemplate(name, role),
        text: `Hi ${name},\n\nYour staff account has been created successfully!\n\nRole: ${role}\n\nYour account is pending approval from an administrator. You will receive another email once your account has been approved.\n\nBest regards,\nLS Radio Team`,
      });
      
      logger.info(`Staff registration email sent to ${email}`);
    } catch (error: any) {
      logger.error('Failed to send staff registration email', { email, error: error.message });
      throw new Error('Failed to send staff registration email');
    }
  }

  private getVerificationEmailTemplate(name: string, verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎙️ LS Radio</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Thank you for registering with LS Radio. We're excited to have you join our community!</p>
            <p>Please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account with LS Radio, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} LS Radio. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getPasswordResetEmailTemplate(name: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎙️ LS Radio</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>You requested to reset your password for your LS Radio account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} LS Radio. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getWelcomeEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to LS Radio!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Your email has been verified successfully! Welcome to the LS Radio community.</p>
            <p>You now have full access to:</p>
            <ul>
              <li>🎙️ Live radio broadcasts</li>
              <li>🎧 Exclusive podcasts</li>
              <li>📚 Audiobooks library</li>
              <li>📅 Upcoming events</li>
              <li>💬 Community chat</li>
            </ul>
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}" class="button">Start Listening</a>
            </div>
            <p>If you have any questions, feel free to reach out to our support team.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} LS Radio. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getStaffRegistrationEmailTemplate(name: string, role: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👋 Welcome to LS Radio Staff!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Your staff account has been created successfully!</p>
            <div class="info-box">
              <strong>Role:</strong> ${role}
            </div>
            <p><strong>⏳ Pending Approval</strong></p>
            <p>Your account is currently pending approval from an administrator. You will receive another email once your account has been approved and you can start using the dashboard.</p>
            <p>In the meantime, here's what you can expect:</p>
            <ul>
              <li>📊 Access to staff dashboard</li>
              <li>🎙️ Broadcast management tools</li>
              <li>📝 Content creation and editing</li>
              <li>👥 Team collaboration features</li>
            </ul>
            <p>If you have any questions, please contact your administrator.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} LS Radio. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
