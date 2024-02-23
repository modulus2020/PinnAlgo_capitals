const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const crypto = require('crypto');
const { promisify } = require('util');

const User = require('../models/userModel');
const Referral = require('../models/referralModel');

const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const sendEmail = require('../utils/email');
const AppError = require('../utils/appError');
const generateReferralLink = require('../utils/generateReferralLink');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

const createAndSendToken = async (data, statusCode, res, next) => {
  // Sign Token
  const { accessToken, refreshToken } = signToken(data._id);
  // Remove Password from output
  data.password = undefined;

  // Send Response
  sendResponse(data, res, statusCode, {
    accessToken,
    refreshToken,
  });
};

const createAndSendTokenWithEmail = async (
  data,
  statusCode,
  res,
  next,
  emailOptions = {
    subject: 'Account Login',
    message: `Dear ${data.firstName}, Your account was recently logged in`,
    email: data.email,
  }
) => {
  // Sign Token
  const token = signToken(data._id);
  // Remove Password from output
  data.password = undefined;

  // Send Response
  sendResponse(data, res, statusCode, { token });
};

exports.signup = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    referralLink,
  } = req.body;

  const payload = { firstName, lastName, email, password, passwordConfirm };

  let newUser;

  if (referralLink) {
    const referee = await User.findOne({ referralLink });
    if (!referee) return next(new AppError('Invalid referral link', 401));
    newUser = await User.create(payload);

    await Referral.create({ referee: referee.id, downline: newUser._id });
  } else {
    newUser = await User.create(payload);
  }

  createAndSendToken(newUser, 201, res, next);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (email && password) {
    // Find User From Database
    const payload = req.query.admin
      ? { email, $or: [{ role: 'admin' }, { role: 'super-admin' }] }
      : { email };
    const user = await User.findOne(payload).select('+password');

    // Checks if user does not exists in db and password is incorrect
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Email or Password is incorrect', 401));
    }

    if (!user.active) {
      return next(
        new AppError('You have been de-activated and hence cannot login', 401)
      );
    }

    // Send JWT
    // createAndSendToken(user, 200, res, next);

    const { accessToken, refreshToken } = signToken(user._id);

    res
      .status(200)
      .json({ status: 'success', accessToken, refreshToken, user });
  } else {
    next(new AppError('Please provide email and password', 401));
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  let token = null;
  // 1) Check if json web token exists and get token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // If there's no token then throw exception
    return next(
      new AppError(
        'You are not logged in! Please log in to access this resource',
        401
      )
    );
  }

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("Can't find user with that token. Please try again", 401)
    );
  }

  // 4) Check if user changed password after json web token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again', 401)
    );
  }
  // Grant Access
  req.user = currentUser;

  next();
});

exports.isAdmin = catchAsync(async (req, res, next) => {
  const isAllowed = ['admin', 'super-admin'];
  if (!isAllowed.includes(req.user.role)) {
    return next(new AppError('only admins can access this route', 401));
  }
  next();
});

exports.isSuperAdmin = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'super-admin') {
    return next(new AppError('only super admins can access this route', 401));
  }
  next();
});

exports.isActive = (req, res, next) => {
  if (req.user.status !== 'active') {
    return next(
      new AppError(
        'This user is inactive and cannot perform this operation',
        401
      )
    );
  }
  next();
};

exports.sendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  // Generate 4 digit OTP and expiry date
  const otp = Math.floor(1000 + Math.random() * 9000);
  const otpExpiration = Date.now() + 10 * 60 * 1000;

  // Find User From Database
  const user = await User.findOne({ email });

  // Checks if user does not exists in db and password is incorrect
  if (!user) {
    return next(new AppError('No user with that email', 404));
  }

  // update user document
  await User.updateOne({ email }, { $set: { otp, otpExpiration } });

  const options = {
    email: 'Cedard686@gmail.com',
    subject: 'Test mail',
    text: `This is your otp ${otp}`,
  };

  await sendEmail(options);

  res.status(200).json({
    status: 'success',
    message: 'email sent!',
  });
});

exports.verifyOtp = catchAsync(async (req, res, next) => {
  const { otp, email } = req.body;

  // find user with email gotten from req body
  const user = await User.findOne({ email });

  // compare OTP
  if (otp !== user.otp) {
    return next(new AppError('Invalid OTP', 403));
  }

  // Check if OTP has expired
  if (Date.now() > user.otpExpiration) {
    return next(new AppError('OTP Expired!', 403));
  }

  // await User.update({ email }, { isVerified: true });

  res.status(200).json({
    status: 'success',
    message: 'Otp verification success!',
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get User Based on the provided email
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    // Throw error if user not found
    return next(new AppError(`Can't find user with email: ${email}`, 404));
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  // The instance method above modifies the user data (passowrdResetToken && passwordResetTokenExpires fields)
  // because of the data modification done by the instance method we need to save the document again
  await user.save({ validateBeforeSave: false });
  // 3) Send Email
  const resetURL = `http://pinnalgo.com/resetPassword.html?token=${resetToken}`;

  const text = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to ${resetURL}\n If you didn't initiate this action you can simply ignore this message`;

  try {
    await sendEmail({
      email,
      subject: 'Forgot Password. (Valid for 10 minutes)',
      text,
    });
    sendResponse(null, res, 200, { message: 'Token Sent To Mail' });
  } catch (err) {
    // If error sending mail remove the passwordResetToken and expiry time from db
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    // Throw error
    return next(
      new AppError('There was an error sending the email. Try again later', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  // (Get user with resetToken if the token is not yet expired)
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    // Throw Error if user is not found
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // 2) If resetToken is not yet expired and there is a user, set new password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();
  // 4) Log user in. Send JWT
  const emailOptions = {
    subject: 'Your Password Has Been Changed',
    message: `Dear ${user.firstName}, Your password was recently changed`,
    email: user.email,
  };

  createAndSendTokenWithEmail(user, 200, res, next, emailOptions);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // This Method allows the user update his password without having to forget it

  // Finds the user by the id of the currently logged in user
  const user = await User.findById(req.user._id).select('password');
  const { currentPassword, newPassword, newConfirmPassword } = req.body;
  // Checks if the current password matches the one in the database
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Your current password is incorrect', 401));
  }
  // Changes the password
  user.password = newPassword;
  user.confirmPassword = newConfirmPassword;
  // Saves the user document
  await user.save();

  // Sends Response with email
  // const emailOptions = {
  //   subject: 'Your Password Has Been Changed',
  //   message: `Dear ${user.firstName}, Your password was recently changed`,
  //   email: user.email,
  // };
  // createAndSendTokenWithEmail(user, 200, res, next, emailOptions);

  // 4) Log user in, send JWT
  createAndSendToken(user, 200, res);
});

// handles google Authentication
exports.googleAuthentication = catchAsync(async (req, res, next) => {
  // Get token from request body
  const { idToken } = req.body;

  // verify token againt google's api
  const response = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const {
    payload: { name, email },
  } = { ...response };

  // Check if user already exists in DB
  const user = await User.findOne({ email });

  // If user exists login, else register
  if (user) {
    return res.status(200).json({ status: 'success', token: idToken, user });
  } else {
    const [firstName, lastName] = name.split(' ');
    const newUser = await User.collection.insertOne({
      firstName,
      lastName,
      email,
      active: true,
    });

    res.status(201).json({ status: 'success', token: idToken, newUser });
  }
});

exports.refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  const decoded = await promisify(jwt.verify)(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  const token = signToken(decoded.id);

  res.status(200).json({
    status: 'success',
    token,
  });
});
