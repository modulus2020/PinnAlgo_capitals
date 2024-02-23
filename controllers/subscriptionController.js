const Subscription = require('../models/subscriptionModel');
const catchAsync = require('../utils/catchAsync');

const factory = require('./handlerFactory');

exports.getAllSubscriptions = factory.getAll(Subscription);

exports.getSingleSubscription = factory.getOne(Subscription);

exports.createSubscription = factory.createOne(Subscription);

exports.updateSubscription = factory.updateOne(Subscription);

exports.deleteSubscription = factory.deleteOne(Subscription);

exports.getActiveSubscriptionsCount = catchAsync(async (req, res, next) => {
  const count = await Subscription.countDocuments({
    expiration: { $gt: Date.now() },
  });

  res.status(200).json({
    status: 'success',
    count,
  });
});
