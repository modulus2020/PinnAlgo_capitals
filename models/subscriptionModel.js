const { Schema, model } = require('mongoose');

const Referral = require('./referralModel');
const User = require('./userModel');

const subscriptionSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'an subscription must belong to a user'],
    },

    attachments: {
      type: [String],
      required: [true, 'subscription must have an attachment'],
    },

    amount: {
      type: Number,
      required: [true, 'subscription must have an amount'],
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
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

subscriptionSchema.post('findOneAndUpdate', async function (doc) {
  if (doc.status === 'approved') {
    // Credit referrer
    const referral = await Referral.findOne({ downline: doc.user });

    await Referral.updateOne(
      { _id: referral._id },
      { amount: +doc.amount * 0.1 }
    );

    await User.updateOne(
      { _id: referral.referee },
      { $inc: { wallet: +doc.amount * 0.1 } }
    );
  }
});

module.exports = model('Subscription', subscriptionSchema, 'subscriptions');
