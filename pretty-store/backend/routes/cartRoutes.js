const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protectUser } = require('../middleware/auth');

router.get('/', protectUser, cartController.getCart);
router.post('/add', protectUser, cartController.addToCart);
router.put('/update', protectUser, cartController.updateCart);
router.delete('/remove/:productId', protectUser, cartController.removeFromCart);
router.delete('/clear', protectUser, cartController.clearCart);

module.exports = router;
