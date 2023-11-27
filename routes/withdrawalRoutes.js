const express = require('express');

const { protect, isAdmin } = require('../controllers/authController');

const {
  getAllWithdrawals,
  getSingleWithdrawal,
  updateWithdrawal,
  createWithdrawal,
  deleteWithdrawal,
} = require('../controllers/withdrawalController');

const {
  attachUser,
  validateAmount,
  checkStatus,
  filterByUser,
} = require('../middlewares/withdrawalMiddlewares');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getAllWithdrawals)
  .post(attachUser, validateAmount, createWithdrawal);

router.get('/my-withdrawals', filterByUser, getAllWithdrawals);

router
  .route('/:id')
  .get(getSingleWithdrawal)
  .patch(isAdmin, checkStatus, updateWithdrawal)
  .delete(isAdmin, deleteWithdrawal);

module.exports = router;
