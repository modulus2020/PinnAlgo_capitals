const moment = require('moment');

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

    transaction_hash: {
      type: String,
      required: [true, 'subscription must have a transaction hash'],
    },

    duration: {
      type: String,
      required: [true, 'subscription must have a duration'],
    },

    amount: {
      type: Number,
      required: [true, 'subscription must have an amount'],
    },

    accountSize: {
      type: Number,
      required: [true, 'subscription must have an account size'],
      min: [500, 'account size has a minimum of $500'],
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    expiration: {
      type: Date,
    },

    server: String,
    mt4Login: String,
    password: String,
    serverType: String,
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

subscriptionSchema.pre('save', function (next) {
  const [data, period] = this.duration.split('-');
  console.log({ data, period });

  const timeline = period === 'year' ? 12 : +data;
  this.expiration = moment().add(timeline, 'months');
  next();
});

// subscriptionSchema.post('save', async function (doc) {
//   if (doc.duration === '1-month') {
//     await User.findByIdAndUpdate(doc.user, { is_new: false });

//     doc.status = 'approved';
//     await doc.save();
//   }
// });

subscriptionSchema.pre(/^find/, function (next) {
  this.populate('user');
  next();
});

subscriptionSchema.post('findOneAndUpdate', async function (doc) {
  if (doc.status === 'approved' && doc.duration !== '1-month') {
    // Credit referrer
    const referral = await Referral.findOne({ downline: doc.user });

    if (referral) {
      await Referral.updateOne(
        { _id: referral._id },
        { amount: +doc.amount * 0.1 }
      );

      await User.updateOne(
        { _id: referral.referee },
        {
          $inc: { wallet: +doc.amount * 0.1, referralBonus: +doc.amount * 0.1 },
        }
      );
    }

    await User.findByIdAndUpdate(doc.user, { subscription: doc });
  }
});

module.exports = model('Subscription', subscriptionSchema, 'subscriptions');
