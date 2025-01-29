const jwt = require('jsonwebtoken');
const { activityLoggerMiddleware } = require('./LogActivity');
const userModel = require('../models/userModel');

const authGuard = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // check or validate
  if (!authHeader) {
    return res.status(400).json({
      success: false,
      message: 'Auth header is missing',
    });
  }

  // Split the data (Format : 'Bearer token-joyboy') -> only token
  const token = authHeader.split(' ')[1];

  // if token is not found : stop the process (res)
  if (!token || token === '') {
    return res.status(400).json({
      success: false,
      message: 'Please provide a token',
    });
  }

  // if token is found then verify
  try {
    const decodeUserData = jwt.verify(token, 'SECRET');
    req.user = decodeUserData; //user info : id onlyf

    // verify user and req.user={id:user._id", email:user.email,  role:user.role}
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    req.user = { id: user._id, email: user.email, role: user.role };

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Not Authenticated',
    });
  }
};

// Admin guard
const adminGuard = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // check or validate
  if (!authHeader) {
    return res.status(400).json({
      success: false,
      message: 'Auth header is missing',
    });
  }

  // Split the data (Format : 'Bearer token-joyboy') -> only token
  const token = authHeader.split(' ')[1];

  // if token is not found : stop the process (res)
  if (!token || token === '') {
    return res.status(400).json({
      success: false,
      message: 'Please provide a token',
    });
  }

  // if token is found then verify
  try {
    const decodeUserData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodeUserData; // id, isadmin
    if (!req.user.isAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Permission Denied',
      });
    }
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    req.user = {
      id: user._id,
      email: user.email,
      isAdmin: user.role === 'admin',
    };
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: 'Not Authenticated',
    });
  }

  // if verified : next (function in controller)
  // if not verified : not auth
};

module.exports = {
  authGuard,
  adminGuard,
};
