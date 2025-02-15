const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const validator = require('validator');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

const isPasswordValid = (password) => {
  const minLength = 8;
  const maxLength = 20;
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  return (
    password.length >= minLength &&
    password.length <= maxLength &&
    regex.test(password)
  );
};

const createUser = async (req, res) => {
  const { fullName, email, phone, password, captchaToken } = req.body;

  if (!fullName || !email || !phone || !password || !captchaToken) {
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required!' });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid email format!' });
  }

  if (!validator.isMobilePhone(phone, 'any')) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid phone number!' });
  }

  if (!isPasswordValid(password)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid password format!' });
  }

  try {
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: { secret: recaptchaSecret, response: captchaToken },
      }
    );

    if (!response.data.success) {
      return res
        .status(400)
        .json({ success: false, message: 'reCAPTCHA verification failed!' });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      fullname: fullName,
      email,
      phone,
      password: hashedPassword,
      passwordHistory: [hashedPassword],
      passwordLastUpdated: Date.now(),
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'User created!' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Internal server error!' });
  }
};
// Login User Controller
const loginUser = async (req, res) => {
  const { email, password, captchaToken } = req.body;
  console.log(email, password, captchaToken);

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
          secret: process.env.RECAPTCHA_SECRET_KEY,
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

  // Track login attempts in-memory
  const ip = req.ip;
  const loginAttempts = global.loginAttempts || {};
  const userKey = `login_attempts:${ip}`;
  const currentAttempts = loginAttempts[userKey] || {
    count: 0,
    timestamp: null,
  };

  if (
    currentAttempts.count >= 2 &&
    currentAttempts.timestamp &&
    Date.now() - currentAttempts.timestamp < 60 * 1000
  ) {
    return res.status(429).json({
      success: false,
      message: 'Too many login attempts, please try again later.',
    });
  }

  // Login logic
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      loginAttempts[userKey] = {
        count: currentAttempts.count + 1,
        timestamp: Date.now(),
      };
      global.loginAttempts = loginAttempts;

      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      loginAttempts[userKey] = {
        count: currentAttempts.count + 1,
        timestamp: Date.now(),
      };
      global.loginAttempts = loginAttempts;

      return res
        .status(400)
        .json({ success: false, message: 'Password is incorrect' });
    }

    // Generate OTP for MFA
    const otp = speakeasy.totp({
      secret: process.env.OTP_SECRET + user._id,
      encoding: 'base32',
    });

    // Store OTP in database with expiration
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 5); // OTP expires in 5 minutes

    user.googleOTP = otp;
    user.googleOTPExpires = otpExpiration;

    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: 'Your One-Time Password (OTP)',
      text: `Your OTP for login is: ${otp}`,
    });

    // Successful login (MFA pending), reset rate limit counter for IP
    delete loginAttempts[userKey];
    global.loginAttempts = loginAttempts;

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete login.',
      userId: user._id,
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

// OTP Verification Controller
const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({
      success: false,
      message: 'User ID and OTP are required!',
    });
  }

  try {
    // Find user and check OTP
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if OTP exists and hasn't expired
    if (!user.googleOTP || !user.googleOTPExpires) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.',
      });
    }

    // Check if OTP has expired
    if (new Date() > user.googleOTPExpires) {
      // Clear expired OTP
      await userModel.findByIdAndUpdate(userId, {
        googleOTP: null,
        googleOTPExpires: null,
      });

      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    // Verify OTP
    if (user.googleOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.',
      });
    }

    // OTP is valid, generate JWT token
    const token = jwt.sign(
      { id: userId, isAdmin: user.role === 'admin' },
      process.env.JWT_SECRET
    );

    // Clear the used OTP
    await userModel.findByIdAndUpdate(userId, {
      googleOTP: null,
      googleOTPExpires: null,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user,
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
  const { phoneNumber } = req.body;
  console.log(phoneNumber);

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

    user.resetPasswordOTP = randomOTP;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    res.status(200).json({
      success: true,
      message: 'OTP sent to your phone number',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const resetPassword = async (req, res) => {
  const { otp, phoneNumber, password } = req.body;
  console.log(otp, phoneNumber, password);

  if (!otp || !phoneNumber || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required.' });
  }

  if (!isPasswordValid(password)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid password format!' });
  }

  try {
    const user = await userModel.findOne({ phone: phoneNumber });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' });
    }

    if (user.resetPasswordOTP !== parseInt(otp)) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: 'OTP has expired.' });
    }

    for (let oldPassword of user.passwordHistory) {
      if (await bcrypt.compare(password, oldPassword)) {
        return res
          .status(400)
          .json({ success: false, message: 'Password cannot be reused!' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.passwordHistory.push(hashedPassword);
    if (user.passwordHistory.length > 5) {
      user.passwordHistory.shift();
    }

    user.passwordLastUpdated = Date.now();
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;

    await user.save();
    res
      .status(200)
      .json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
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
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};

const updateProfile = async (req, res) => {
  const id = req.user.id;
  const { fullname, email, phone } = req.body;

  if (!fullname || !email || !phone) {
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required!' });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid email format!' });
  }

  if (!validator.isMobilePhone(phone, 'any')) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid phone number!' });
  }

  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' });
    }

    user.fullname = fullname;
    user.email = email;
    user.phone = phone;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: 'Profile updated successfully.', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
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
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
const enforcePasswordExpiry = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' });
    }

    const daysSinceLastUpdate =
      (Date.now() - user.passwordLastUpdated) / (1000 * 60 * 60 * 24);

    if (daysSinceLastUpdate > 90) {
      return res.status(403).json({
        success: false,
        message:
          'Your password has expired. Please reset your password to continue.',
      });
    }

    next();
  } catch (error) {
    console.error('Error checking password expiry:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = {
  limiter,
  createUser,
  loginUser,
  verifyOTP,
  forgetPassword,
  resetPassword,
  getSingleUser,
  getAllUser,
  updateProfile,
  getToken,
  enforcePasswordExpiry,
};
