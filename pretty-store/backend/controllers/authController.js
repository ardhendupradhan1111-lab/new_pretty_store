const User = require('../models/User');
const Settings = require('../models/Settings');
const jwt = require('jsonwebtoken');
const { generateOTP } = require('../utils/emailService');
const { sendOTPSMS } = require('../utils/smsService');

exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || !/^\d{10}$/.test(phone.replace(/^\+91/, '')))
      return res.status(400).json({ success: false, message: 'Valid 10-digit phone number required' });

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + (process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000);
    user.otp = { code: otp, expiresAt, attempts: 0 };
    await user.save();

    await sendOTPSMS(phone, otp);

    res.json({ success: true, message: `OTP sent to ${phone}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Failed to send OTP' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res.status(400).json({ success: false, message: 'Phone and OTP required' });

    const user = await User.findOne({ phone });
    if (!user || !user.otp?.code)
      return res.status(400).json({ success: false, message: 'No OTP request found for this number' });

    if (user.otp.attempts >= 3) {
      user.otp = undefined;
      await user.save();
      return res.status(429).json({ success: false, message: 'Too many attempts. Request a new OTP.' });
    }

    if (new Date() > user.otp.expiresAt) {
      user.otp = undefined;
      await user.save();
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
    }

    if (user.otp.code !== otp) {
      user.otp.attempts += 1;
      await user.save();
      return res.status(400).json({ success: false, message: `Invalid OTP. ${3 - user.otp.attempts} attempts left.` });
    }

    user.otp = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    res.json({
      success: true,
      token,
      user: { id: user._id, phone: user.phone, name: user.name, email: user.email },
      isNewUser: !user.name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getEnabledPaymentMethods = async (req, res) => {
  try {
    const methods = await Settings.getPaymentMethods();
    res.json({ success: true, methods });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
