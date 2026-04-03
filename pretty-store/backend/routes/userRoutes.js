const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protectUser } = require('../middleware/auth');

router.get('/profile', protectUser, userController.getProfile);
router.put('/profile', protectUser, userController.updateProfile);
router.post('/address', protectUser, userController.addAddress);
router.put('/address/:addressId', protectUser, userController.updateAddress);
router.delete('/address/:addressId', protectUser, userController.deleteAddress);

module.exports = router;
