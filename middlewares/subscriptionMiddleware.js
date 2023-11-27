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

  req.body.amount = plans[duration] * accountSize + 10;

  next();
});

exports.uploadAttachments = catchAsync(async (req, res, next) => {
  if (req.files) {
    const promises = req.files.attachments.map((file) => handleUpload(file));

    const attachments = await Promise.all(promises);

    req.body.attachments = attachments;
  }
  next();
});
