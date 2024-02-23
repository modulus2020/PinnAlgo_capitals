const { signToken } = require('../controllers/authController');
const User = require('../models/userModel');
const getJwt = async () => {
  const user = await User.findOne({ email: 'cedard@gmail.com' });
  const token = signToken(user._id);

  return { token, userId: user._id };
};

module.exports = getJwt;
