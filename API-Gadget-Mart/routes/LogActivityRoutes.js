const express = require('express');
const router = express.Router();
const activityController = require('../controllers/LogActivityController'); // Import the controller
const { adminGuard } = require('../middleware/authGuard');
const { activityLoggerMiddleware } = require('../middleware/LogActivity');

// Route to get all activities
router.get(
  '/activities',
  adminGuard,
  activityLoggerMiddleware,
  activityController.getAllActivities
);

module.exports = router;
