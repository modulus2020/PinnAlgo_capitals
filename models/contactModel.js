const { mongoose } = require('mongoose');
const validator = require('validator');

const constactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already in use'],
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

module.exports = mongoose.model('contact', constactSchema, 'contacts');
