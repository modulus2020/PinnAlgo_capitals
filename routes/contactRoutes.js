const express = require('express');

const {
  getAllContacts,
  getSingleContact,
  updateContact,
  createContact,
  deleteContact,
} = require('../controllers/contactController');

const router = express.Router();

router.route('/').get(getAllContacts).post(createContact);

router
  .route('/:id')
  .get(getSingleContact)
  .patch(updateContact)
  .delete(deleteContact);

module.exports = router;
