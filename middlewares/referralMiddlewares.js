const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.filterByUser = catchAsync(async (req, res, next) => {
  req.query.referee = req.user.id;
  next();
});
