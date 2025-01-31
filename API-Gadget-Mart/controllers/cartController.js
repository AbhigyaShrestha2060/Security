const Cart = require('../models/cartModel');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Sanitize input for strings only
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input);
  }
  return input;
};

exports.addToCart = async (req, res) => {
  let { productId, quantity, total } = req.body;
  const id = req.user.id;

  productId = sanitizeInput(productId);
  quantity = parseInt(quantity, 10);
  total = parseFloat(total);

  if (
    !productId ||
    isNaN(quantity) ||
    quantity <= 0 ||
    isNaN(total) ||
    total <= 0
  ) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  try {
    const itemInCart = await Cart.findOne({
      productId,
      userId: id,
      status: 'active',
    });

    if (itemInCart) {
      itemInCart.quantity += quantity;
      itemInCart.total = itemInCart.quantity * (total / quantity);
      await itemInCart.save();
      return res
        .status(200)
        .json({ message: 'Item quantity updated', cartItem: itemInCart });
    }

    const cartItem = new Cart({ productId, quantity, total, userId: id });
    await cartItem.save();
    res.status(200).json({ message: 'Item added to cart', cartItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCartItems = async (req, res) => {
  const id = req.user.id;
  try {
    const cartItems = await Cart.find({
      userId: id,
      status: 'active',
    }).populate('productId');
    res
      .status(200)
      .json({ carts: cartItems, message: 'Cart items fetched successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndDelete(id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    let { quantity, total } = req.body;

    quantity = parseInt(quantity, 10);
    total = parseFloat(total);

    if (isNaN(quantity) || quantity <= 0 || isNaN(total) || total <= 0) {
      return res.status(400).json({ error: 'Invalid quantity or total' });
    }

    await Cart.findByIdAndUpdate(id, { quantity, total });
    res.status(200).json({ message: 'Item updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserCartStatus = async (req, res) => {
  try {
    const id = req.user.id;
    const { status } = req.body;

    const validStatuses = ['active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid cart status' });
    }

    await Cart.updateMany({ userId: id }, { status });
    res.status(200).json({ message: 'Cart status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
