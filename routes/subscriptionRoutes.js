const express = require('express');
const imageupload = require('express-fileupload');

const { protect, isAdmin } = require('../controllers/authController');

const {
  getAllSubscriptions,
  getSingleSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getActiveSubscriptionsCount,
} = require('../controllers/subscriptionController');

const {
  attachUser,
  calculateAmount,
  uploadAttachments,
  checkStatus,
  filterByUser,
  getServerDetails,
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
router.get('/active-subscriptions-count', getActiveSubscriptionsCount);

router
  .route('/:id')
  .get(getSingleSubscription)
  .patch(isAdmin, checkStatus, updateSubscription)
  .delete(isAdmin, deleteSubscription);

router.patch(
  '/:id/update-mt4-mt5-details',
  getServerDetails,
  updateSubscription
);

module.exports = router;
