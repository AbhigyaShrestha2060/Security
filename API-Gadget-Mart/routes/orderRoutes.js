const router = require('express').Router();
const { activityLoggerMiddleware } = require('../middleware/LogActivity');
const orderController = require('../controllers/orderController');
const { authGuard } = require('../middleware/authGuard');

router.post(
  '/create',
  authGuard,
  activityLoggerMiddleware,
  orderController.addOrder
);
router.get(
  '/get',
  authGuard,
  activityLoggerMiddleware,
  orderController.getAllOrders
);
router.put(
  '/update/:id',
  authGuard,
  activityLoggerMiddleware,
  orderController.updateOrderStatus
);
router.get(
  '/user',
  authGuard,
  activityLoggerMiddleware,
  orderController.getUserOrders
);
module.exports = router;
