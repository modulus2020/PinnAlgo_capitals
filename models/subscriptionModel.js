const { Schema, model } = require('mongoose');

const Referral = require('./referralModel');

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
      enum: ['pending', 'accepted', 'rejected'],
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

subscriptionSchema.pre('save', async function (next) {
  if (this.isDirectModified('status') && this.status === 'accepted') {
    // Credit referrer
    const referral = await Referral.findOne({ downline: this._id });

    await Referral.updateOne({ _id: referral._id }, { amount: +this.amount });

    await User.updateOne(
      { _id: referral.referee },
      { $inc: { wallet: +this.amount } }
    );
  }

  next();
});

module.exports = model('Subscription', subscriptionSchema, 'subscriptions');
