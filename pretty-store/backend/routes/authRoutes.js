const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { otpLimiter, loginLimiter } = require('../middleware/rateLimiter');

router.post('/send-otp', otpLimiter, authController.sendOTP);
router.post('/verify-otp', loginLimiter, authController.verifyOTP);
router.get('/payment-methods', authController.getEnabledPaymentMethods);

module.exports = router;
