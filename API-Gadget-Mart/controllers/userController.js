const userModel = require('../models/userModel');
const redis = require('redis');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendOtp = require('../service/sendOtp');
const user = require('../models/userModel');
const axios = require('axios');

const redisClient = redis.createClient();

// Registering the user with reCAPTCHA verification
const createUser = async (req, res) => {
  // Log incoming data
  console.log(req.body);

  // Destructure incoming data
  const { fullName, email, phone, password, captchaToken } = req.body;

  // Validate the incoming data
  if (!fullName || !email || !phone || !password || !captchaToken) {
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required!' });
  }

  // Verify reCAPTCHA token
  try {
    const recaptchaSecret = '6LeqWbMqAAAAAFIAIzAa04QYfwzOGOP7ua6vBWSn';
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${recaptchaSecret}&response=${captchaToken}`,
      }
    );
    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return res
        .status(400)
        .json({ success: false, message: 'reCAPTCHA verification failed!' });
    }
  } catch (error) {
    console.error('reCAPTCHA Verification Error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'reCAPTCHA verification error!' });
  }

  try {
    // Check if the user already exists
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists!' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = new userModel({
      fullname: fullName,
      email: email,
      phone: phone,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ success: true, message: 'User created!' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Internal server error!' });
  }
};

// Logging in the user with rate limiting and reCAPTCHA verification

const loginUser = async (req, res) => {
  const { email, password, captchaToken } = req.body;

  if (!email || !password || !captchaToken) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required, including CAPTCHA!',
    });
  }

  // Verify CAPTCHA
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: '6LeqWbMqAAAAAFIAIzAa04QYfwzOGOP7ua6vBWSn',
          response: captchaToken,
        },
      }
    );

    if (!response.data.success) {
      return res
        .status(400)
        .json({ success: false, message: 'CAPTCHA validation failed!' });
    }
  } catch (err) {
    console.error('CAPTCHA validation error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'CAPTCHA validation error' });
  }

  // Check rate limit (5 attempts per minute)
  const ip = req.ip;
  const userKey = `login_attempts:${ip}`;
  const attempts = await redisClient.getAsync(userKey);

  if (attempts >= 5) {
    return res.status(429).json({
      success: false,
      message: 'Too many login attempts, please try again later.',
    });
  }

  // Login logic
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      await redisClient.incrAsync(userKey);
      await redisClient.expireAsync(userKey, 60); // Expire in 1 minute
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      await redisClient.incrAsync(userKey);
      await redisClient.expireAsync(userKey, 60);
      return res
        .status(400)
        .json({ success: false, message: 'Password is incorrect' });
    }

    // Successful login, clear rate limit counter
    await redisClient.delAsync(userKey);

    const token = await jwt.sign(
      { id: user._id, isAdmin: user.role === 'admin' },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      success: true,
      message: 'Logged in Successfully!',
      token: token,
      user: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server error',
      error: err,
    });
  }
};

// forgot password by using phone number
const forgetPassword = async (req, res) => {
  console.log(req.body);

  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      message: 'Please enter your phone number',
    });
  }
  try {
    const user = await userModel.findOne({ phone: phoneNumber });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    // Generate OTP
    const randomOTP = Math.floor(100000 + Math.random() * 900000);
    console.log(randomOTP);

    user.resetPasswordOTP = randomOTP;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    // // Send OTP to user phone number
    // const isSent = await sendOtp(phone, randomOTP);

    // if (!isSent) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Error in sending OTP",
    //   });
    // }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your phone number',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const resetPassword = async (req, res) => {
  console.log(req.body);
  const { otp, phoneNumber, password } = req.body;
  if (!otp || !phoneNumber || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please enter all fields',
    });
  }
  try {
    const user = await userModel.findOne({ phone: phoneNumber });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    // Otp to integer
    const otpToInteger = parseInt(otp);

    if (user.resetPasswordOTP !== otpToInteger) {
      return res.status(400).json({
        success: false,
        message: 'OTP is incorrect',
      });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP is expired',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
// get single user
const getSingleUser = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'User found',
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};

// get all user
const getAllUser = async (req, res) => {
  try {
    const allUsers = await userModel.find();
    res.status(200).json({
      success: true,
      message: 'All users',
      users: allUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};

// update profile
const updateProfile = async (req, res) => {
  const id = req.user.id;
  const { fullname, email, phone, password } = req.body;
  if (!fullname || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Please enter all fields',
    });
  }
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    user.fullname = fullname;
    user.email = email;
    user.phone = phone;
    user.password = password;
    await user.save();
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getToken = async (req, res) => {
  const id = req.body.id;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    const token = await jwt.sign(
      { id: user._id, isAdmin: user.role === 'admin' },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      success: true,
      message: 'Token generated',
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  forgetPassword,
  resetPassword,
  getSingleUser,
  getAllUser,
  updateProfile,
  getToken,
};
