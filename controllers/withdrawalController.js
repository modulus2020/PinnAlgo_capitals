const Withdrawal = require('../models/withdrawModel');

const factory = require('./handlerFactory');

exports.getAllWithdrawals = factory.getAll(Withdrawal);

exports.getSingleWithdrawal = factory.getOne(Withdrawal);

exports.createWithdrawal = factory.createOne(Withdrawal);

exports.updateWithdrawal = factory.updateOne(Withdrawal);

exports.deleteWithdrawal = factory.deleteOne(Withdrawal);
