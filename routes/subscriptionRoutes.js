const express = require('express');
const imageupload = require('express-fileupload');

const { protect, isAdmin } = require('../controllers/authController');

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
  checkStatus,
  filterByUser,
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

router.get('/my-subscriptions', filterByUser, getAllSubscriptions);

router
  .route('/:id')
  .get(getSingleSubscription)
  .patch(isAdmin, checkStatus, updateSubscription)
  .delete(isAdmin, deleteSubscription);

module.exports = router;
