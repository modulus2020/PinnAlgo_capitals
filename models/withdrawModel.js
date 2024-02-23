const { Schema, model } = require('mongoose');
const User = require('./userModel');

const withdrawalSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'a withrawal must have a user'],
    },

    amount: {
      type: Number,
      min: 20,
      required: [true, 'a withrawal must have a user'],
    },

    walletAddress: {
      type: String,
      required: [true, 'a withrawal must have a wallet address'],
    },

    status: {
      type: String,
      enum: ['pending', 'rejected', 'approved'],
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

withdrawalSchema.pre(/^find/, function (next) {
  this.populate('user');
  next();
});

withdrawalSchema.pre('save', async function (next) {
  if (this.amount < 1) {
    this.amount = this.amount * -1;
  }
  next();
});

withdrawalSchema.post('findOneAndUpdate', async function (doc) {
  if (doc.status === 'approved') {
    // Credit referrer
    const user = await User.findById(doc.user);

    await User.updateOne({ _id: user.id }, { $inc: { wallet: -doc.amount } });
  }
});

module.exports = model('Withdrawal', withdrawalSchema, 'withdrawals');
