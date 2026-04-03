const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Settings = require('../models/Settings');

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, razorpayOrderId, razorpayPaymentId } = req.body;

    // Validate payment method is enabled
    const methods = await Settings.getPaymentMethods();
    if (!methods[paymentMethod])
      return res.status(400).json({ success: false, message: `${paymentMethod} is not available` });

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || !cart.items.length)
      return res.status(400).json({ success: false, message: 'Cart is empty' });

    const items = [];
    let subtotal = 0;

    for (const item of cart.items) {
      if (!item.product || !item.product.isActive)
        return res.status(400).json({ success: false, message: `Product ${item.product?.title || 'unknown'} is no longer available` });
      if (item.product.stock < item.quantity)
        return res.status(400).json({ success: false, message: `Insufficient stock for ${item.product.title}` });

      items.push({
        product: item.product._id,
        title: item.product.title,
        image: item.product.images[0]?.url || '',
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      });
      subtotal += item.product.price * item.quantity;
    }

    const shippingCharge = subtotal >= 499 ? 0 : 49;
    const total = subtotal + shippingCharge;

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      razorpayOrderId,
      razorpayPaymentId,
      subtotal,
      shippingCharge,
      total,
      statusHistory: [{ status: 'Placed', note: 'Order placed successfully' }]
    });

    // Deduct stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    await order.populate('user', 'name phone');
    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Order.countDocuments({ user: req.user._id });
    res.json({ success: true, orders, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getOrderByIdAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name phone email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const filter = {};
    if (req.query.status) filter.orderStatus = req.query.status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user', 'name phone'),
      Order.countDocuments(filter)
    ]);
    res.json({ success: true, orders, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = status;
    order.statusHistory.push({ status, note: note || '' });
    if (status === 'Delivered') order.paymentStatus = 'Paid';
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
