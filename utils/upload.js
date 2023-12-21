const path = require('path');

const cloudinary = require('./cloudinary');
const datauri = require('datauri/parser');

const dUri = new datauri();

const getDataUri = (fileName, buffer) =>
  dUri.format(path.extname(fileName).toString(), buffer);

const upload = async (file) => {
  const { name, data } = file;

  const datauri = getDataUri(name, data);
  const response = await cloudinary.uploader.upload(datauri.content);
  return response.secure_url;
};

module.exports = upload;

