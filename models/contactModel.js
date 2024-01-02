const { mongoose } = require('mongoose');
const validator = require('validator');
const sendEmail = require('../utils/email');
const contactSupport = require('../templates/contactSupport');

const constactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      validate: [validator.isEmail, 'Email provided must be a valid email'],
    },

    message: {
      type: String,
      required: [true, 'message is required'],
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

constactSchema.post('save', async function ({ name, email, message }) {
  await sendEmail({
    email: 'support@pinnalgo.com',
    subject: 'Contact Message',
    html: contactSupport(name, email, message),
  });
});

module.exports = mongoose.model('contact', constactSchema, 'contacts');
