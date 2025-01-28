const express = require('express');
const router = express.Router();
const activityController = require('../controllers/LogActivityController'); // Import the controller
const { adminGuard } = require('../middleware/authGuard');

// Route to get all activities
router.get('/activities', adminGuard, activityController.getAllActivities);

module.exports = router;
