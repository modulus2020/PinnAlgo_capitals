const { Schema, model } = require('mongoose');

const User = require('./userModel');

const referralSchema = new Schema(
  {
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
  },

  {
    strict: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },

    timestamps: true,
  }
);

referralSchema.pre(/^find/, function (next) {
  this.populate('downline');
  next();
});

referralSchema.post('save', async function (doc) {
  const referrals = await this.constructor.countDocuments({
    referee: doc.referee,
  });
  await User.findByIdAndUpdate(doc.referee, { totalReferrals: referrals });
});

module.exports = model('Referral', referralSchema, 'referrals');
