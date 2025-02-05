import express from 'express';
import Order from '../models/Orders.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    const order = new Order({
      user: req.user.userId,
      items,
      totalAmount,
      shippingAddress
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;