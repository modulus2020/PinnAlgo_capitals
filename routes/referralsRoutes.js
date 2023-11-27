const express = require('express');

const { protect } = require('../controllers/authController');

const {
  getAllReferrals,
  getSingleReferral,
  updateReferral,
  deleteReferral,
} = require('../controllers/referralController');

const router = express.Router();

router.use(protect);

router.route('/').get(getAllReferrals);

router
  .route('/:id')
  .get(getSingleReferral)
  .patch(updateReferral)
  .delete(deleteReferral);

module.exports = router;
