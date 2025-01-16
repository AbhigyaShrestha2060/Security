const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordHistory: {
      type: [String], // Array of previous hashed passwords
      default: [],
    },
    passwordLastUpdated: {
      type: Date,
      default: Date.now, // Set to current date by default
    },
    role: {
      type: String,
      default: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resetPasswordOTP: {
      type: Number,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    googleOTP: {
      type: String,
      default: null,
    },
    googleOTPExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure only the last 5 passwords are stored
userSchema.pre('save', function (next) {
  if (this.passwordHistory.length > 5) {
    this.passwordHistory = this.passwordHistory.slice(-5); // Keep only the last 5 entries
  }
  next();
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
