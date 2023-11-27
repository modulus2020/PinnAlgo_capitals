const Organisation = require('../../models/organisationModel');
const User = require('../../models/userModel');

const payload = async () => {
  let user = await User.findOne();
  let organisation = await Organisation.findOne();
  return {
    user: user.id,
    organisation: organisation.id,
    role: 'owner',
  };
};

module.exports = payload;
