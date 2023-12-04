const { mongoose } = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    complaint: {
      type: String,
      required: [true, 'title is required'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },

    status: {
      type: String,
      enum: ['closed', 'open'],
      default: 'open',
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

ticketSchema.pre(/^find/, function (next) {
  this.populate('user');
  next();
});

const Ticket = mongoose.model('ticket', ticketSchema, 'tickets');

module.exports = Ticket;
