const Admin = require('../models/Admin');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const jwt = require('jsonwebtoken');
const { generateOTP, sendAdminOTPEmail } = require('../utils/emailService');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    // Auto-seed admin on first login attempt
    let admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      // Only allow seeding the configured admin email
      if (email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      admin = await Admin.create({ email: email.toLowerCase(), password, name: 'Admin' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    res.json({ success: true, token, admin: { id: admin._id, email: admin.email, name: admin.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email: email?.toLowerCase() });
    if (!admin)
      return res.status(404).json({ success: false, message: 'No admin found with this email' });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + (process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000);

    admin.resetOTP = { code: otp, expiresAt, attempts: 0 };
    await admin.save();

    await sendAdminOTPEmail(email, otp);
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const admin = await Admin.findOne({ email: email?.toLowerCase() });
    if (!admin || !admin.resetOTP?.code)
      return res.status(400).json({ success: false, message: 'No OTP request found' });

    if (admin.resetOTP.attempts >= 3) {
      admin.resetOTP = undefined;
      await admin.save();
      return res.status(429).json({ success: false, message: 'Too many attempts. Request a new OTP.' });
    }

    if (new Date() > admin.resetOTP.expiresAt) {
      admin.resetOTP = undefined;
      await admin.save();
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
    }

    if (admin.resetOTP.code !== otp) {
      admin.resetOTP.attempts += 1;
      await admin.save();
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Issue a short-lived reset token
    const resetToken = jwt.sign({ id: admin._id, purpose: 'reset' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    admin.resetOTP = undefined;
    await admin.save();

    res.json({ success: true, resetToken });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword)
      return res.status(400).json({ success: false, message: 'Token and new password required' });

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    if (decoded.purpose !== 'reset')
      return res.status(400).json({ success: false, message: 'Invalid reset token' });

    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    admin.password = newPassword;
    await admin.save();

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid or expired token' });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, recentOrders, orderStats] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      User.countDocuments({ isActive: true }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name phone'),
      Order.aggregate([
        { $group: { _id: '$orderStatus', count: { $sum: 1 }, revenue: { $sum: '$total' } } }
      ])
    ]);

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentOrders,
        orderStats
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const users = await User.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    const total = await User.countDocuments();
    res.json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPaymentMethods = async (req, res) => {
  try {
    const methods = await Settings.getPaymentMethods();
    res.json({ success: true, methods });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updatePaymentMethods = async (req, res) => {
  try {
    const { methods } = req.body;
    await Settings.findOneAndUpdate(
      { key: 'paymentMethods' },
      { value: methods },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: 'Payment methods updated', methods });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
