import Log from '../models/LogActivityModel.js';
// Controller method to get all activities

export const getAllActivities = async (req, res) => {
  try {
    // Fetch logs from the database
    const logs = await Log.find().sort({ createdAt: -1 }); // Most recent logs first
    res.status(200).json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching activity logs:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
