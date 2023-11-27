const express = require('express');
const imageupload = require('express-fileupload');

const { protect } = require('../controllers/authController');

const {
  getAllSubscriptions,
  getSingleSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} = require('../controllers/subscriptionController');

const {
  attachUser,
  calculateAmount,
  uploadAttachments,
} = require('../middlewares/subscriptionMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getAllSubscriptions)
  .post(
    imageupload(),
    attachUser,
    calculateAmount,
    uploadAttachments,
    createSubscription
  );

router
  .route('/:id')
  .get(getSingleSubscription)
  .patch(updateSubscription)
  .delete(deleteSubscription);

module.exports = router;
