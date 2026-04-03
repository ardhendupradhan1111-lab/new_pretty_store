const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protectUser, protectAdmin } = require('../middleware/auth');

// User routes
router.post('/', protectUser, orderController.createOrder);
router.get('/my-orders', protectUser, orderController.getUserOrders);
router.get('/:id', protectUser, orderController.getOrderById);

// Admin routes
router.get('/', protectAdmin, orderController.getAllOrders);
router.get('/:id/admin', protectAdmin, orderController.getOrderByIdAdmin);
router.put('/:id/status', protectAdmin, orderController.updateOrderStatus);

module.exports = router;
