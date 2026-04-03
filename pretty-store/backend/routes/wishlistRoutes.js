const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { protectUser } = require('../middleware/auth');

router.get('/', protectUser, wishlistController.getWishlist);
router.post('/toggle/:productId', protectUser, wishlistController.toggleWishlist);

module.exports = router;
