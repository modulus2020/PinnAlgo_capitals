const catchAsync = require('../utils/catchAsync');

exports.filterByUser = catchAsync(async (req, res, next) => {
  req.query.referee = req.user.id;
  next();
});
 