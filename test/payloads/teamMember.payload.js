const User = require("../../models/userModel");
const Form = require("../../models/formModel");

const payload = async () => {
  let user = await User.findOne();
  let form = await Form.findOne();
  return {
    email: user.email,
    form: form.id,
  };
};

module.exports = payload;
