const orderModel = require('../models/orderModel');
const DOMPurify = require('dompurify');

const sanitizeInput = (input) => DOMPurify.sanitize(input);

exports.addOrder = async (req, res) => {
  try {
    let { carts, address, total, paymentType, totalAmount } = req.body;

    address = sanitizeInput(address);
    paymentType = sanitizeInput(paymentType);
    total = parseFloat(sanitizeInput(total ?? totalAmount));

    if (!carts || !address || !paymentType || isNaN(total) || total <= 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid order data' });
    }

    const order = new orderModel({
      carts,
      address,
      total,
      paymentType,
      userId: req.user.id,
    });

    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate('carts')
      .populate('userId')
      .sort({ createdAt: -1, status: 1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.user.id })
      .populate('carts')
      .populate({
        path: 'carts',
        populate: {
          path: 'productId',
          model: 'products',
        },
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid order status' });
    }

    const order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await orderModel.findByIdAndUpdate(id, { status });
    res.status(200).json({ success: true, message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
