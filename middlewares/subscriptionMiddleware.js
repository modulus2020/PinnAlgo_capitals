const Subscription = require('../models/subscriptionModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const plans = require('../dictionaries/monthlyPlans');
const handleUpload = require('../utils/upload');

exports.attachUser = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  next();
});

exports.calculateAmount = catchAsync(async (req, res, next) => {
  const { accountSize, duration } = req.body;

  if (!plans[duration])
    return next(new AppError('Please input a valid duration', 403));

  req.body.amount = plans[duration].compute(accountSize);

  next();
});

exports.uploadAttachments = catchAsync(async (req, res, next) => {
  if (req.files.attachments) {
    const attachments = await handleUpload(req.files.attachments);

    req.body.attachments = [attachments];
  }
  next();
});

exports.checkStatus = catchAsync(async (req, res, next) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription)
    return next(new AppError('no subscription with that ID', 404));

  if (subscription.status === 'approved' && req.body.status === 'approved') {
    return next(
      new AppError('This subscription has already been approved', 403)
    );
  }

  next();
});

exports.filterByUser = catchAsync(async (req, res, next) => {
  req.query.user = req.user.id;
  next();
});

exports.getServerDetails = catchAsync(async (req, res, next) => {
  const { server, mt4Login, password } = req.body;

  const subscription = await Subscription.findById(req.params.id);

  if (!subscription)
    return next(new AppError('no subscription with that ID', 401));

  if (subscription.user.id !== req.user.id) {
    return next(
      new AppError('You cannot update subscription of another user', 401)
    );
  }

  req.body = { server, mt4Login, password };

  next();
});
