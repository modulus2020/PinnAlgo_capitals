const Withdrawal = require('../models/withdrawModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.attachUser = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  next();
});

exports.filterByUser = catchAsync(async (req, res, next) => {
  req.query.user = req.user.id;
  next();
});

exports.validateAmount = catchAsync(async (req, res, next) => {
  const { amount } = req.body;
  if (req.user.wallet < amount) {
    return next(new AppError('Insufficient funds', 403));
  }
  next();
});

exports.checkStatus = catchAsync(async (req, res, next) => {
  const withrawal = await Withdrawal.findById(req.params.id);

  if (!withrawal) return next(new AppError('no withrawal with that ID', 401));

  if (withrawal.status === 'approved') {
    return next(new AppError('This withrawal has already been approved', 403));
  }

  next();
});
