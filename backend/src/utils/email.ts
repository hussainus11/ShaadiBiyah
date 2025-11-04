import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const emailTemplates = {
  welcome: (data: any) => ({
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to WeddingSaaS, ${data.firstName}!</h2>
        <p>Thank you for joining our wedding planning platform. Please verify your email address to get started.</p>
        <a href="${process.env.FRONTEND_URL}/verify-email?token=${data.verificationToken}" 
           style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>If the button doesn't work, copy and paste this link:</p>
        <p>${process.env.FRONTEND_URL}/verify-email?token=${data.verificationToken}</p>
      </div>
    `
  }),
  passwordReset: (data: any) => ({
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello ${data.firstName},</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${data.resetToken}" 
           style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>If the button doesn't work, copy and paste this link:</p>
        <p>${process.env.FRONTEND_URL}/reset-password?token=${data.resetToken}</p>
        <p>This link will expire in 1 hour.</p>
      </div>
    `
  }),
  bookingConfirmation: (data: any) => ({
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Confirmation</h2>
        <p>Hello ${data.firstName},</p>
        <p>Your booking has been confirmed!</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
          <h3>Booking Details:</h3>
          <p><strong>Vendor:</strong> ${data.vendorName}</p>
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Date:</strong> ${data.eventDate}</p>
          <p><strong>Time:</strong> ${data.eventTime}</p>
          <p><strong>Total Amount:</strong> $${data.totalAmount}</p>
        </div>
      </div>
    `
  })
};

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@shaadibiyah.com',
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Legacy function for backward compatibility
export const sendTemplateEmail = async ({ email, subject, template, data }: any) => {
  try {
    const templateData = emailTemplates[template as keyof typeof emailTemplates](data);
    
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@shaadibiyah.com',
      to: email,
      subject,
      html: templateData.html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
