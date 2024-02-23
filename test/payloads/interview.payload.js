let Form = require("../../models/organisationModel");

const payload = async () => {
  let form = await Form.findOne();
  return {
    firstname: "Uju",
    lastname: "Ofodu",
    email: "ujuofodu@gmail.com",
    form: form.id,
    date: new Date("2023-08-20T12:00:00Z"),
  };
};

module.exports = payload;
