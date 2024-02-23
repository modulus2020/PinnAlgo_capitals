const { v4: uuidv4 } = require('uuid');

const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const tokenEncrypt = require('../utils/tokenEncrypt');
const generateRandom10DigitNumber = require('../utils/generateReferralLink');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First Name is required'],
    },

    lastName: {
      type: String,
      required: [true, 'Last Name is required'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already in use'],
      validate: [validator.isEmail, 'Email provided must be a valid email'],
    },

    password: {
      type: String,
      required: [true, 'User Must Provide Password'],
      minlength: [8, 'Password must be 8 or more characters'],
      select: false,
    },

    active: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ['user', 'admin', 'super-admin'],
      default: 'user',
    },

    wallet: { type: Number, default: 0 },

    subscription: {
      type: Object,
      default: null,
    },

    is_new: { type: Boolean, default: true },

    confirmPassword: {
      type: String,
      validate: {
        validator: function (value) {
          return value === this.password;
        },
      },
    },

    passwordResetTokenExpires: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    referralLink: Number,

    totalReferrals: {
      type: Number,
      default: 0,
    },

    referralBonus: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: 'active',
    },

    walletAddress: String,
    otp: Number,
    otpExpiration: Date,
  },
  {
    strict: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },

    timestamps: true,
  }
);

// Document Middleware
userSchema.pre('save', async function (next) {
  // 1) Hash Password
  if (this.isNew === true) {
    this.password = await bcrypt.hash(this.password, 12);
    // 2) Remove confirmPassword field
    this.confirmPassword = undefined;
  }

  this.referralLink = generateRandom10DigitNumber();

  next();
});

userSchema.pre('save', async function (next) {
  if (this.isDirectModified('password') === false || this.isNew) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Instance Methods -> This method is available on every document created with this model
userSchema.methods.correctPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // This checks if the password was changed after the token has been signed and sent
  if (this.passwordChangedAt) {
    // Convert the pasword changed time to timestamp
    // The Reason why we divide by 1000 is because the changedTimestamp is in milliseconds while
    // the JWTTimestamp is in seconds so we need to make sure they're both in the same format
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means the password has not been changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = tokenEncrypt(resetToken);

  // Set the password reset token to expire in 10 minutes
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
