const Subscription = require('../models/subscriptionModel');

const factory = require('./handlerFactory');

exports.getAllSubscriptions = factory.getAll(Subscription);

exports.getSingleSubscription = factory.getOne(Subscription);

exports.createSubscription = factory.createOne(Subscription);

exports.updateSubscription = factory.updateOne(Subscription);

exports.deleteSubscription = factory.deleteOne(Subscription);
