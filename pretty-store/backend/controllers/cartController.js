const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) return res.json({ success: true, cart: { items: [], subtotal: 0 } });

    const validItems = cart.items.filter(i => i.product && i.product.isActive);
    const subtotal = validItems.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
    res.json({ success: true, cart: { items: validItems, subtotal } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isActive)
      return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.stock < quantity)
      return res.status(400).json({ success: false, message: 'Insufficient stock' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existingItem = cart.items.find(i =>
      i.product.toString() === productId && i.size === size && i.color === color
    );

    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock);
    } else {
      cart.items.push({ product: productId, quantity, size, color });
    }

    await cart.save();
    await cart.populate('items.product');
    const subtotal = cart.items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
    res.json({ success: true, cart: { items: cart.items, subtotal }, message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.find(i =>
      i.product.toString() === productId && i.size === size && i.color === color
    );
    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => !(i.product.toString() === productId && i.size === size));
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product');
    const subtotal = cart.items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
    res.json({ success: true, cart: { items: cart.items, subtotal } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
