const router = require('express').Router();
const userController = require('../controllers/userController');
const { authGuard } = require('../middleware/authGuard');
const { activityLoggerMiddleware } = require('../middleware/LogActivity');

// Login User
router.post('/login', activityLoggerMiddleware, userController.loginUser);

router.post('/verifyOTP', activityLoggerMiddleware, userController.verifyOTP);

// Create User
router.post('/create', activityLoggerMiddleware, userController.createUser);

// forgot password
router.post(
  '/forgot_password',
  activityLoggerMiddleware,
  userController.forgetPassword
);

// reset password
router.post(
  '/reset_password',
  activityLoggerMiddleware,
  userController.resetPassword
);

// get single user
router.get(
  '/get_single_user',
  authGuard,
  activityLoggerMiddleware,
  userController.getSingleUser
);

// update profile
router.put(
  '/update_profile',
  authGuard,
  activityLoggerMiddleware,
  userController.updateProfile
);

// get all user
router.get(
  '/get_all_user',
  authGuard,
  activityLoggerMiddleware,
  userController.getAllUser
);

router.post('/getToken', userController.getToken);

module.exports = router;
