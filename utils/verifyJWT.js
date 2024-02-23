const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = async (token, refreshToken) => {
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    const decoded = await promisify(jwt.verify)(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    return decoded;
  }
};
