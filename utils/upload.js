const stream = require('stream');

const cloudinary = require('./cloudinary');

const upload = async (file) => {
  const response = await cloudinary.uploader.upload(file);
  return response.secure_url;
};

module.exports = upload;
