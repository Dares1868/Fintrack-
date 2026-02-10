const nodemailer = require('nodemailer');

// Create transporter for MailHog
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'mailhog',
    port: 1025,
    ignoreTLS: true,
    auth: false
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetLink, userName = '') => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: '"Fintrack App" <noreply@fintrack.com>',
      to: email,
      subject: 'Reset Your Password - Fintrack',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #2d2647 0%, #3a335b 100%); padding: 30px; border-radius: 12px; color: white; text-align: center;">
            <h1 style="color: #977dff; margin: 0 0 20px 0; font-size: 28px;">Fintrack</h1>
            <h2 style="margin: 0 0 20px 0; font-size: 24px;">Password Reset Request</h2>
            ${userName ? `<p style="font-size: 18px; margin-bottom: 20px;">Hello ${userName},</p>` : ''}
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              We received a request to reset your password. Click the button below to reset it:
            </p>
            
            <a href="${resetLink}" style="
              display: inline-block;
              background-color: #977dff;
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 30px;
            ">Reset My Password</a>
            
            <p style="font-size: 14px; color: #bcb6f6; margin-bottom: 10px;">
              This link will expire in 30 minutes for security reasons.
            </p>
            
            <p style="font-size: 14px; color: #bcb6f6; margin-bottom: 20px;">
              If you didn't request this password reset, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.2); margin: 20px 0;">
            
            <p style="font-size: 12px; color: #bcb6f6;">
              If the button doesn't work, copy and paste this link in your browser:<br>
              <span style="word-break: break-all;">${resetLink}</span>
            </p>
          </div>
        </div>
      `,
      text: `
        Fintrack - Password Reset Request
        
        Hello${userName ? ' ' + userName : ''},
        
        We received a request to reset your password. Please click the link below to reset it:
        
        ${resetLink}
        
        This link will expire in 30 minutes for security reasons.
        
        If you didn't request this password reset, please ignore this email.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Test email function
const sendTestEmail = async (email) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: '"Fintrack App" <noreply@fintrack.com>',
      to: email,
      subject: 'Test Email - Fintrack',
      html: '<h1>Test Email</h1><p>MailHog is working correctly!</p>',
      text: 'Test Email - MailHog is working correctly!'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendTestEmail
};
