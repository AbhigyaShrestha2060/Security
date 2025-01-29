const router = require('express').Router();
const paymentController = require('../controllers/paymentController');
const { authGuard } = require('../middleware/authGuard');
const { activityLoggerMiddleware } = require('../middleware/LogActivity');

router.post(
  '/initialize-khalti',
  authGuard,
  activityLoggerMiddleware,
  paymentController.initializePayment
);
router.get(
  '/complete-khalti-payment',
  authGuard,
  activityLoggerMiddleware,
  paymentController.completeKhaltiPayment
);

module.exports = router;
