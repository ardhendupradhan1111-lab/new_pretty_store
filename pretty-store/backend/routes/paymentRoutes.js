const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protectUser } = require('../middleware/auth');

router.post('/create-order', protectUser, paymentController.createRazorpayOrder);
router.post('/verify', protectUser, paymentController.verifyPayment);

module.exports = router;
