const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendAdminOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Pretty Store" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: '🔐 Pretty Store - Password Reset OTP',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #e91e8c, #9c27b0); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">💕 Pretty Store</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Admin Panel</p>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #666;">You requested a password reset for your admin account. Use the OTP below:</p>
          <div style="background: linear-gradient(135deg, #fce4ec, #f3e5f5); border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <p style="color: #666; font-size: 14px; margin: 0 0 8px;">Your OTP Code</p>
            <h1 style="color: #e91e8c; font-size: 42px; margin: 0; letter-spacing: 8px; font-weight: 700;">${otp}</h1>
          </div>
          <p style="color: #999; font-size: 13px;">⏰ This OTP expires in <strong>${process.env.OTP_EXPIRY_MINUTES || 10} minutes</strong></p>
          <p style="color: #999; font-size: 13px;">🔒 If you didn't request this, please ignore this email.</p>
        </div>
        <div style="background: #f5f5f5; padding: 15px; text-align: center;">
          <p style="color: #aaa; font-size: 12px; margin: 0;">© 2024 Pretty Store. All rights reserved.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};
