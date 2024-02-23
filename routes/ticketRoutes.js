const {
  createTicket,
  updateTicket,
  getAllTickets,
  getSingleTicket,
  deleteTicket,
  ticketSearch,
} = require('../controllers/ticketController');

const { protect, isAdmin } = require('./../controllers/authController');
const { attachUser } = require('../middlewares/ticketMiddlewares');

const { Router } = require('express');

const router = Router();

router.use(protect);

router.route('/').post(attachUser, createTicket).get(isAdmin, getAllTickets);

router.use(isAdmin);

router.get('/search/:description', ticketSearch);

router
  .route('/:id')
  .patch(updateTicket)
  .get(getSingleTicket)
  .delete(deleteTicket);

module.exports = router;
