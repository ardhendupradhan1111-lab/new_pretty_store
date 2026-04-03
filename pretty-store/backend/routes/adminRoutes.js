const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/auth');
const { loginLimiter, otpLimiter } = require('../middleware/rateLimiter');

// Auth
router.post('/login', loginLimiter, adminController.login);
router.post('/forgot-password', otpLimiter, adminController.forgotPassword);
router.post('/verify-otp', adminController.verifyOTP);
router.post('/reset-password', adminController.resetPassword);

// Protected
router.get('/dashboard', protectAdmin, adminController.getDashboard);
router.get('/users', protectAdmin, adminController.getUsers);
router.put('/users/:id/status', protectAdmin, adminController.updateUserStatus);

// Payment Methods
router.get('/payment-methods', protectAdmin, adminController.getPaymentMethods);
router.put('/payment-methods', protectAdmin, adminController.updatePaymentMethods);

module.exports = router;
