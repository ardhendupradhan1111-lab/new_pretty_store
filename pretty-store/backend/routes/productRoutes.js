const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protectAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Public
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Admin only
router.post('/', protectAdmin, upload.array('images', 5), productController.createProduct);
router.put('/:id', protectAdmin, upload.array('images', 5), productController.updateProduct);
router.delete('/:id', protectAdmin, productController.deleteProduct);

module.exports = router;
