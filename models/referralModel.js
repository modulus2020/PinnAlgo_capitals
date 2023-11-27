const { Schema, model } = require('mongoose');

const referralSchema = new Schema({
  referee: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'a referral must have a referee'],
  },

  downline: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'a referral must have a downline'],
  },

  amount: {
    type: Number,
    default: 0,
  },
});

referralSchema.pre(/^find/, function (next) {
  this.populate('downline');
  next();
});

module.exports = model('Referral', referralSchema, 'referrals');
