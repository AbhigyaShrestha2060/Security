import Activity from '../models/LogActivityModel.js';
const logActivity = async (
  userId,
  action,
  description = null,
  ipAddress = null
) => {
  try {
    const activity = new Activity({
      userId,
      action,
      description,
      ipAddress,
      timestamp: new Date(),
    });
    await activity.save();
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export const activityLoggerMiddleware = async (req, res, next) => {
  const userId = req.user ? req.user.id : 'Anonymous'; // Extract user ID if authenticated
  const action = `${req.method} ${req.originalUrl}`;
  const description = req.body.description || null;
  const ipAddress = req.ip || req.connection.remoteAddress; // Get the user's IP address

  await logActivity(userId, action, description, ipAddress);
  next();
};
