const Referral = require('../models/referralModel');
const catchAsync = require('../utils/catchAsync');

const factory = require('./handlerFactory');

exports.getAllReferrals = factory.getAll(Referral);

exports.getAllReferral = catchAsync(async (req, res, next) => {
    const referrals = await Referral.find().populate('referee');
    
      res.status(200).json({ status: 'success', doc: { referrals } });
})

exports.getSingleReferral = factory.getOne(Referral);

exports.updateReferral = factory.updateOne(Referral);
 
exports.deleteReferral = factory.deleteOne(Referral);
