import moment from 'moment'; // Import the moment package to format dates
import Activity from '../models/LogActivityModel.js';

// Controller method to get all activities
export const getAllActivities = async (req, res) => {
  try {
    // Get the real IP address
    const ipAddress = req.headers['x-forwarded-for'] || req.ip;

    // Fetch all activity records, sorted by timestamp in descending order (latest first)
    const activities = await Activity.find().sort({ timestamp: -1 });

    // Format the timestamp of each activity
    const formattedActivities = activities.map((activity) => {
      return {
        ...activity.toObject(), // Convert Mongoose document to plain JavaScript object
        timestamp: moment(activity.timestamp).format('YYYY-MM-DD HH:mm:ss'), // Format timestamp
        ipAddress: ipAddress, // Use the fetched IP address
      };
    });

    // Send a response with all the activities
    return res.status(200).json(formattedActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return res.status(500).json({
      message: 'Error fetching activities',
      error: error.message,
    });
  }
};
