// routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authGuard } = require('../middleware/authGuard');
const { activityLoggerMiddleware } = require('../middleware/LogActivity');

// Route to add item to cart
router.post(
  '/add',
  authGuard,
  activityLoggerMiddleware,
  cartController.addToCart
);

// Route to get all cart items
router.get(
  '/all',
  authGuard,
  activityLoggerMiddleware,
  cartController.getAllCartItems
);

// Route to delete item from cart
router.delete(
  '/delete/:id',
  authGuard,
  activityLoggerMiddleware,
  cartController.deleteCartItem
);

// Route to update item in cart
router.put(
  '/update/:id',
  authGuard,
  activityLoggerMiddleware,
  cartController.updateCartItem
);

// Route to update status in cart
router.put(
  '/status',
  authGuard,
  activityLoggerMiddleware,
  cartController.updateUserCartStatus
);

module.exports = router;
