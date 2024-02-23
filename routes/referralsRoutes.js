const express = require('express');

const { protect } = require('../controllers/authController');

const {
  getAllReferrals,
  getSingleReferral,
  updateReferral,
  deleteReferral,
  getAllReferral,
} = require('../controllers/referralController');

const { filterByUser } = require('../middlewares/referralMiddlewares');

const router = express.Router();

router.use(protect);

router.route('/').get(getAllReferrals);



router.get('/my-referrals', filterByUser, getAllReferrals);

router.get('/referrals', getAllReferral);

router
  .route('/:id')
  .get(getSingleReferral)
  .patch(updateReferral)
  .delete(deleteReferral);

module.exports = router;
