const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.attachUser = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  next();
});
