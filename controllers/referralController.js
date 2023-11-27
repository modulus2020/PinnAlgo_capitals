const Referral = require('../models/referralModel');

const factory = require('./handlerFactory');

exports.getAllReferrals = factory.getAll(Referral);

exports.getSingleReferral = factory.getOne(Referral);

exports.updateReferral = factory.updateOne(Referral);

exports.deleteReferral = factory.deleteOne(Referral);
