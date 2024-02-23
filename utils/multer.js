const multer = require('multer');

const AppError = require('./appError');

const allowed = ['application/pdf'];

const multerFilter = (req, file, cb) => {
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError('Not a pdf file! Please upload only pdf files', 400),
      false
    );
  }
};

const multerStorage = multer.diskStorage({});

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

module.exports = upload;

//64e5f9c3bde5f6fed16ced71
