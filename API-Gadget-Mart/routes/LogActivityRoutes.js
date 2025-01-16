const express = require('express');
const router = express.Router();
const activityController = require('../controllers/LogActivityController'); // Import the controller

// Route to get all activities
router.get('/activities', activityController.getAllActivities);

module.exports = router;
